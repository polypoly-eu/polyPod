use crate::common::serialization::{message_pack_deserialize, message_pack_serialize};
use crate::core_failure::CoreFailure;
use std::ffi::CStr;
use std::os::raw::c_uint;
extern crate rmp_serde;
use crate::core::{self, PlatformRequest, PlatformResponse};
use std::os::raw::c_char;

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
    create_byte_buffer(message_pack_serialize(bootstrap(language_code, fs_root)))
}

/// # Safety
/// This function can be unsafe if the features_dir pointer is null or the string is in wrong format.
///
/// Loads the feature categories from from the given features_dir.
/// - features_dir: Path to directory where feature categories are stored.
/// Returns Result<Vec<FeatureCategory>, CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn load_feature_categories(features_dir: *const c_char) -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(
        cstring_to_str(&features_dir).and_then(core::load_feature_categories),
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

unsafe fn byte_buffer_to_bytes(buffer: &CByteBuffer) -> Result<Vec<u8>, String> {
    let length: usize = buffer
        .length
        .try_into()
        .map_err(|_| "Could not get buffer length".to_string())?;
    let slice = std::slice::from_raw_parts(buffer.data, length);
    Ok(slice.to_vec())
}

#[repr(C)]
pub struct BridgeToPlatform {
    free_bytes: extern "C" fn(bytes: *mut u8),
    perform_request: extern "C" fn(request: CByteBuffer) -> CByteBuffer,
}

impl core::PlatformHookRequest for BridgeToPlatform {
    fn perform_request(&self, request: PlatformRequest) -> Result<PlatformResponse, String> {
        let request_byte_buffer = unsafe { create_byte_buffer(message_pack_serialize(request)) };
        let response_byte_buffer = (self.perform_request)(request_byte_buffer);
        let bytes = unsafe { byte_buffer_to_bytes(&response_byte_buffer)? };
        // deserialize returns Result<Result<PlatformResponse, String>>
        // so don't forget the ? at the end in the next line.
        let response: Result<PlatformResponse, String> = message_pack_deserialize(bytes)?;
        (self.free_bytes)(response_byte_buffer.data);
        return response;
    }
}
