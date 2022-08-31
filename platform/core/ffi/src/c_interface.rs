use common::serialization::{message_pack_deserialize, message_pack_serialize};
use core_failure::CoreFailure;
use std::ffi::CStr;
use std::os::raw::c_uint;
extern crate rmp_serde;
use lib::core::{self, PlatformRequest, PlatformResponse};
use std::os::raw::c_char;
#[cfg(feature = "rdf")]
use crate::rdf_result_conversion::{bytes_to_string, to_json_bytes};

/// # Safety
/// This function can be unsafe if the language_code pointer is null or the string is in wrong format.
///
/// Mention - It is needed to be tested in integration if `*const u8` is the appropriate return format.
///           Also, most likely, it will be required to expose an API to deallocate the byte buffer after parsing.
///
/// Bootstrap core with the given configuration:
/// - language_code: User's locale language code.
/// Returns a flatbuffer byte array with core_bootstrap_response.
#[no_mangle]
pub unsafe extern "C" fn core_bootstrap(
    language_code: *const c_char,
    fs_root: *const c_char,
    bridge: BridgeToPlatform,
) -> CByteBuffer {
    fn bootstrap(
        language_code: *const c_char,
        fs_root: *const c_char,
        bridge: BridgeToPlatform,
    ) -> Result<(), CoreFailure> {
        unsafe {
            let language_code = String::from(cstring_to_str(&language_code)?);
            let fs_root = String::from(cstring_to_str(&fs_root)?);
            core::bootstrap(language_code, fs_root, Box::new(bridge))
        }
    }
    create_byte_buffer(message_pack_serialize(bootstrap(
        language_code,
        fs_root,
        bridge,
    )))
}

/// # Safety
/// This function can be unsafe if the features_dir pointer is null or the string is in wrong format.
///
/// Loads the feature categories from from the given features dir.
/// - args: Function arguments as MessagePack value.
/// Returns Result<Vec<FeatureCategory>, CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn load_feature_categories(args: CByteBuffer) -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(
        byte_buffer_to_bytes(&args)
            .and_then(message_pack_deserialize)
            .and_then(core::load_feature_categories),
    ))
}

/// Notify that app did become inactive.
/// Returns Result<(), CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn app_did_become_inactive() -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(core::app_did_become_inactive()))
}

/// Ask if user session is expired.
/// Returns Result<bool, CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn is_user_session_expired() -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(core::is_user_session_expired()))
}

/// Set the user session timeout option to a given one.
/// - option: Timeout Option as MessagePack value.
/// - free_bytes: A callback function to be used to free bytes.
/// Returns Result<(), CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn set_user_session_timeout_option(
    option: CByteBuffer,
    free_bytes: extern "C" fn(bytes: *mut u8),
) -> CByteBuffer {
    fn set_timeout_option(
        option: CByteBuffer,
        free_bytes: extern "C" fn(bytes: *mut u8),
    ) -> Result<(), CoreFailure> {
        let bytes = unsafe { byte_buffer_to_bytes(&option)? };
        free_bytes(option.data);
        core::set_user_session_timeout_option(message_pack_deserialize(bytes)?)?;
        Ok(())
    }
    create_byte_buffer(message_pack_serialize(set_timeout_option(
        option, free_bytes,
    )))
}

/// Get the currently configured user session timeout option.
/// Returns Result<TimeoutOption, CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn get_user_session_timeout_option() -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(
        core::get_user_session_timeout_option(),
    ))
}

/// Get the user session timeout config options.
/// Returns Result<Vec<UserSessionTimeout>, CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn get_user_session_timeout_options_config() -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(
        core::get_user_session_timeout_options_config(),
    ))
}

/// Executes the given RDF query.
/// Returns Result<String, CoreFailure> as MessagePack value.
#[no_mangle]
#[cfg(feature = "rdf")]
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
#[cfg(feature = "rdf")]
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

// Disabled the clippy false positive, https://github.com/rust-lang/rust-clippy/issues/5787
#[allow(clippy::needless_lifetimes)]
unsafe fn cstring_to_str<'a>(cstring: &'a *const c_char) -> Result<&str, CoreFailure> {
    if cstring.is_null() {
        return Err(CoreFailure::null_c_string_pointer());
    }

    CStr::from_ptr(*cstring)
        .to_str()
        .map_err(|err| CoreFailure::failed_to_create_c_str(err.to_string()))
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

#[repr(C)]
pub struct BridgeToPlatform {
    free_bytes: extern "C" fn(bytes: *mut u8),
    perform_request: extern "C" fn(request: CByteBuffer) -> CByteBuffer,
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
