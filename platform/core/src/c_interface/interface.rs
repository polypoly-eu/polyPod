use crate::{
    c_interface::{
        core_bootstrap_fbs_mapping::build_core_bootstrap_response,
        feature_manifest_fbs_mapping::build_feature_manifest_parsing_response,
        utils::{CByteBuffer, cstring_to_str},
    },
    core::{bootstrap, parse_feature_manifest},
};
use std::os::raw::{c_char, c_uint};

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
pub unsafe extern "C" fn core_bootstrap(language_code: *const c_char) -> CByteBuffer {
    create_byte_buffer(
        build_core_bootstrap_response(
            cstring_to_str(&language_code)
                .map(String::from)
                .and_then(bootstrap),
        )
    )
}

/// # Safety
/// This function can be unsafe if the json pointer is null or the string is in wrong format.
///
/// Parse the given feature maniest json.
/// - json: Feature manifest json string to be parsed.
/// Returns a flatbuffer byte array with feature_manifest_response.
#[no_mangle]
pub unsafe extern "C" fn parse_feature_manifest_from_json(json: *const c_char) -> CByteBuffer {
    create_byte_buffer(
        build_feature_manifest_parsing_response(cstring_to_str(&json).and_then(parse_feature_manifest))
    )
}

unsafe fn create_byte_buffer(bytes: Vec<u8>) -> CByteBuffer {
    let slice = bytes.into_boxed_slice();
    CByteBuffer { length: slice.len() as c_uint, data: Box::into_raw(slice) as *mut u8 }
}
