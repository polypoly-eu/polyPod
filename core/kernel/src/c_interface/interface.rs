use crate::{
    c_interface::{
        feature_manifest_fbs_mapping::build_feature_manifest_parsing_response,
        kernel_bootstrap_fbs_mapping::build_kernel_bootstrap_response, utils::cstring_to_str,
    },
    feature_manifest_parsing::FeatureManifest,
    kernel::{bootstrap, parse_feature_manifest},
    kernel_failure::KernelFailure,
};
use std::os::raw::c_char;

/// # Safety
/// This function can be unsafe if the language_code pointer is null or the string is in wrong format.
///
/// Mention - It is needed to be tested in integration if `*const u8` is the appropriate return format.
///           Also, most likely, it will be required to expose an API to deallocate the byte buffer after parsing.
///
/// Bootstrap the kernel with the given configuration:
/// - language_code: User's locale language code.
/// Returns a flatbuffer byte array with kernel_bootstrap_response.
#[no_mangle]
pub unsafe extern "C" fn kernel_bootstrap(language_code: *const c_char) -> *const u8 {
    unsafe fn kernel_bootstrap_result(language_code: *const c_char) -> Result<(), KernelFailure> {
        let language_code = cstring_to_str(&language_code).map(String::from)?;
        bootstrap(language_code)
    }

    build_kernel_bootstrap_response(kernel_bootstrap_result(language_code)).as_ptr()
}

/// # Safety
/// This function can be unsafe if the json pointer is null or the string is in wrong format.
///
/// Parse the given feature maniest json.
/// - json: Feature manifest json string to be parsed.
/// Returns a flatbuffer byte array with feature_manifest_response.
#[no_mangle]
pub unsafe extern "C" fn parse_feature_manifest_from_json(json: *const c_char) -> *const u8 {
    unsafe fn parse_manifest_result(json: *const c_char) -> Result<FeatureManifest, KernelFailure> {
        let json = cstring_to_str(&json)?;
        parse_feature_manifest(json)
    }
    build_feature_manifest_parsing_response(parse_manifest_result(json)).as_ptr()
}
