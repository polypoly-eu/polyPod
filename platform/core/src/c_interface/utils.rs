use crate::kernel_failure::KernelFailure;
use std::{ffi::CStr, os::raw::c_char};

// Disabled the clippy false positive, https://github.com/rust-lang/rust-clippy/issues/5787
#[allow(clippy::needless_lifetimes)]
pub unsafe fn cstring_to_str<'a>(cstring: &'a *const c_char) -> Result<&str, KernelFailure> {
    if cstring.is_null() {
        return Err(KernelFailure::null_c_string_pointer());
    }

    CStr::from_ptr(*cstring)
        .to_str()
        .map_err(|err| KernelFailure::failed_to_create_c_str(err.to_string()))
}
