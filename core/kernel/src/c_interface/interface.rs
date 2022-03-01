use crate::{
    feature_manifest_parsing::FeatureManifest,
    kernel::Kernel,
    kernel::KERNEL,
    kernel_failure::KernelFailure, 
    c_interface::{feature_manifest_fbs_mapping::build_feature_manifest_parsing_response, kernel_bootstrap_fbs_mapping::build_kernel_bootstrap_response},
};
use std::{
    ffi::{CStr},
    os::raw::c_char
};

/// # Safety
/// This function can be unsafe if the language_code pointer is null or the string is in wrong format.
///
/// Bootstrap the kernel with the given configuration:
/// - language_code: User's locale language code
/// Returns the result JSON of either success or failure to bootstrap the kernel
#[no_mangle]
pub unsafe extern "C" fn kernel_bootstrap(language_code: *const c_char) -> *const u8 {
    unsafe fn bootstrap(language_code: *const c_char) -> Result<(), KernelFailure> {
        let language_code = cstring_to_str(&language_code).map(String::from)?;
        Kernel::bootstrap(language_code)
    }

    build_kernel_bootstrap_response(bootstrap(language_code)).as_ptr()
}

/// # Safety
/// This function can be unsafe if the json pointer is null or the string is in wrong format.
///
/// Parse the feature manifest from a given JSON.
/// Returns the JSON with the parsed feature manifest by taking into account the user's locale language code.
///
/// This is unfortunate at the moment that this API gets a JSON and responds back with a JSON. Ideally the kernel
/// would be able to read all the features from the disk on its own and return back a JSON with all of the features.
/// It was choosen to return back to platform code a JSON, as composing complex C model is not nice. For example
/// Rust's HashMap cannot be directly mapped to C, and instead of working with Opaque types and pointers to access data from a hashmap - use the JSON.
/// The JSON would allow to easily represent any complex data model in a standard way.
///
/// This API would be an example of any further API that will be added. That is - the API would respond back with a JSON
/// containing the result of the operation with any meaningfull payload or error code/message.
#[no_mangle]
pub unsafe extern "C" fn parse_feature_manifest(json: *const c_char) -> *const u8 {
    unsafe fn parse_manifest(json: *const c_char) -> Result<FeatureManifest, KernelFailure> {
        let kernel = get_kernel()?;
        let json = cstring_to_str(&json)?;
        kernel
            .parse_feature_manifest(json)
    }
    build_feature_manifest_parsing_response(parse_manifest(json)).as_ptr()
}

fn get_kernel() -> Result<&'static Kernel, KernelFailure> {
    match KERNEL.get() {
        Some(kernel) => Ok(kernel),
        None => Err(KernelFailure::kernel_not_bootstraped()),
    }
}


// Disabled the clippy false positive, https://github.com/rust-lang/rust-clippy/issues/5787
#[allow(clippy::needless_lifetimes)]
unsafe fn cstring_to_str<'a>(cstring: &'a *const c_char) -> Result<&str, KernelFailure> {
    if cstring.is_null() {
        return Err(KernelFailure::null_c_string_pointer());
    }

    CStr::from_ptr(*cstring)
        .to_str()
        .map_err(|err| KernelFailure::failed_to_create_c_str(err.to_string()))
}