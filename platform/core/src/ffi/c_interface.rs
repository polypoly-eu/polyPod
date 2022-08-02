use crate::core_failure::CoreFailure;
use crate::ffi::{deserialize, serialize};
use std::ffi::CStr;
use std::os::raw::c_uint;
extern crate rmp_serde;
use crate::core::{self, NativeRequest, NativeResponse};
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
    bridge: BridgeToNative,
) -> CByteBuffer {
    // TODO: Use bridge to native
    create_byte_buffer(serialize(
        cstring_to_str(&language_code)
            .map(String::from)
            .and_then(|language_code| core::bootstrap(language_code, Box::new(bridge))),
    ))
}

/// # Safety
/// This function can be unsafe if the features_dir pointer is null or the string is in wrong format.
///
/// Loads the feature categories from from the given features_dir.
/// - features_dir: Path to directory where feature categories are stored.
/// Returns Result<Vec<FeatureCategory>, CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn load_feature_categories(features_dir: *const c_char) -> CByteBuffer {
    create_byte_buffer(serialize(
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

unsafe fn byte_buffer_to_bytes(buffer: &CByteBuffer) -> Vec<u8> {
    let slice = std::slice::from_raw_parts(buffer.data, buffer.length.try_into().unwrap());
    slice.to_vec()
}

#[repr(C)]
pub struct BridgeToNative {
    free_bytes: extern "C" fn(bytes: *mut u8),
    perform_request: extern "C" fn(request: CByteBuffer) -> CByteBuffer,
}

impl core::PlatformHookRequest for BridgeToNative {
    fn perform_request(&self, request: NativeRequest) -> Result<NativeResponse, String> {
        let request_byte_buffer = unsafe { create_byte_buffer(serialize(request)) };
        let response_byte_buffer = (self.perform_request)(request_byte_buffer);
        let response: Result<NativeResponse, String> =
            unsafe { deserialize(byte_buffer_to_bytes(&response_byte_buffer)) };
        // match &response {
        //     Ok(value) => match value {
        //         NativeResponse::FeatureName(name) => {
        //             let x = name.to_owned();
        //             print!("");
        //         }
        //     },
        //     Err(err) => {
        //         let x = err.to_owned();
        //         print!("");
        //     }
        // };
        (self.free_bytes)(response_byte_buffer.data);
        return response;
    }
}
