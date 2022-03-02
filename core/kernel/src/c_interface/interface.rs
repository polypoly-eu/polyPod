use crate::{
    c_interface::{
        feature_manifest_fbs_mapping::build_feature_manifest_parsing_response,
        kernel_bootstrap_fbs_mapping::build_kernel_bootstrap_response,
    },
    feature_manifest_parsing::FeatureManifest,
    kernel::Kernel,
    kernel::KERNEL,
    kernel_failure::KernelFailure,
};
use std::{ffi::CStr, os::raw::c_char};

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
#[no_mangle]
pub unsafe extern "C" fn parse_feature_manifest(json: *const c_char) -> *const u8 {
    unsafe fn parse_manifest(json: *const c_char) -> Result<FeatureManifest, KernelFailure> {
        let kernel = get_kernel()?;
        let json = cstring_to_str(&json)?;
        kernel.parse_feature_manifest(json)
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
