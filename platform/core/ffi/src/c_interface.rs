use common::serialization::{message_pack_deserialize, message_pack_serialize};
use core_failure::CoreFailure;
use std::os::raw::c_uint;
extern crate rmp_serde;
#[cfg(feature = "poly_rdf")]
use crate::rdf_result_conversion::{bytes_to_string, to_json_bytes};
use lib::core::{self, PlatformRequest, PlatformResponse};

#[repr(C)]
pub struct BridgeToPlatform {
    free_bytes: extern "C" fn(bytes: *mut u8),
    perform_request: extern "C" fn(request: CByteBuffer) -> CByteBuffer,
}

/// # Safety
/// This function can be unsafe if the language_code pointer is null or the string is in wrong format.
///
/// Mention - It is needed to be tested in integration if `*const u8` is the appropriate return format.
///           Also, most likely, it will be required to expose an API to deallocate the byte buffer after parsing.
///
/// Bootstrap core with the given configuration:
/// - language_code: User's locale language code.
/// Returns a MessagePack byte array with core_bootstrap_response.
#[no_mangle]
pub unsafe extern "C" fn core_bootstrap(
    args: CByteBuffer,
    bridge: BridgeToPlatform,
) -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(
        byte_buffer_to_bytes(&args)
            .and_then(message_pack_deserialize)
            .and_then(|args| core::bootstrap(args, Box::new(bridge))),
    ))
}

#[no_mangle]
pub unsafe extern "C" fn execute_request(core_request: CByteBuffer) -> CByteBuffer {
    create_byte_buffer(
        match byte_buffer_to_bytes(&core_request).and_then(message_pack_deserialize) {
            Ok(request) => core::exec_request(request),
            Err(err) => message_pack_serialize(Err::<(), _>(err)),
        }
    )
}

/// Executes the given RDF query.
/// Returns Result<String, CoreFailure> as MessagePack value.
#[no_mangle]
#[cfg(feature = "poly_rdf")]
pub unsafe extern "C" fn exec_rdf_query(query: *const c_char) -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(
        cstring_to_str(&query)
            .map(String::from)
            .and_then(core::exec_rdf_query)
            .and_then(to_json_bytes)
            .and_then(bytes_to_string),
    ))
}

/// Executes the given RDF update.
/// Returns Result<Void, CoreFailure> as MessagePack value.
#[no_mangle]
#[cfg(feature = "poly_rdf")]
pub unsafe extern "C" fn exec_rdf_update(update: *const c_char) -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(
        cstring_to_str(&update)
            .map(String::from)
            .and_then(core::exec_rdf_update),
    ))
}

/// # Safety
/// This function can be unsafe if trying to deallocate invalid memory.
///
/// Drops the given bytes.
#[no_mangle]
pub unsafe extern "C" fn free_bytes(bytes: *mut u8) {
    drop(Box::from_raw(bytes))
}

#[repr(C)]
pub struct CByteBuffer {
    pub length: c_uint,
    pub data: *mut u8,
}

unsafe fn create_byte_buffer(bytes: Vec<u8>) -> CByteBuffer {
    let slice = bytes.into_boxed_slice();
    CByteBuffer {
        length: slice.len() as c_uint,
        data: Box::into_raw(slice) as *mut u8,
    }
}

unsafe fn byte_buffer_to_bytes(buffer: &CByteBuffer) -> Result<Vec<u8>, CoreFailure> {
    let length: usize = buffer
        .length
        .try_into()
        .map_err(|_| CoreFailure::failed_to_read_byte_buffer_length())?;
    let slice = std::slice::from_raw_parts(buffer.data, length);
    Ok(slice.to_vec())
}

impl core::PlatformHookRequest for BridgeToPlatform {
    fn perform_request(&self, request: PlatformRequest) -> Result<PlatformResponse, CoreFailure> {
        let request_byte_buffer = unsafe { create_byte_buffer(message_pack_serialize(request)) };
        let response_byte_buffer = (self.perform_request)(request_byte_buffer);
        let bytes = unsafe { byte_buffer_to_bytes(&response_byte_buffer)? };
        // deserialize returns Result<Result<PlatformResponse, String>>
        // so don't forget the ? at the end in the next line.
        let response: Result<PlatformResponse, CoreFailure> = message_pack_deserialize(bytes)?;
        (self.free_bytes)(response_byte_buffer.data);
        return response;
    }
}
