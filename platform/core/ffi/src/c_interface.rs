use common::serialization::{message_pack_deserialize, message_pack_serialize};
use core_failure::CoreFailure;
use std::os::raw::c_uint;
extern crate rmp_serde;
use lib::platform_request::{PlatformRequest, PlatformCallback};
use lib::bootstrap::bootstrap;
use lib::core_request::exec_request;

#[repr(C)]
pub struct BridgeToPlatform {
    free_bytes: extern "C" fn(bytes: *mut u8),
    perform_request: extern "C" fn(request: CByteBuffer) -> CByteBuffer,
}

impl PlatformCallback for BridgeToPlatform {
    fn perform_request(&self, request: PlatformRequest) -> Result<Vec<u8>, CoreFailure> {
        let request_byte_buffer = unsafe { create_byte_buffer(message_pack_serialize(request)) };
        let response_byte_buffer = (self.perform_request)(request_byte_buffer);
        let bytes = unsafe { byte_buffer_to_bytes(&response_byte_buffer) };
        (self.free_bytes)(response_byte_buffer.data);
        return bytes;
    }
}

#[no_mangle]
pub unsafe extern "C" fn core_bootstrap(
    args: CByteBuffer,
    bridge: BridgeToPlatform,
) -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(
        byte_buffer_to_bytes(&args)
            .and_then(message_pack_deserialize)
            .and_then(|args| bootstrap(args, Box::new(bridge))),
    ))
}

#[no_mangle]
pub unsafe extern "C" fn execute_request(core_request: CByteBuffer) -> CByteBuffer {
    create_byte_buffer(
        match byte_buffer_to_bytes(&core_request).and_then(message_pack_deserialize) {
            Ok(request) => exec_request(request),
            Err(err) => message_pack_serialize(Err::<(), _>(err)),
        },
    )
}

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
