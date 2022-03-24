use crate::core_failure::CoreFailure;
use std::{ffi::CStr, os::raw::{c_char, c_uint}};

// Disabled the clippy false positive, https://github.com/rust-lang/rust-clippy/issues/5787
#[allow(clippy::needless_lifetimes)]
pub unsafe fn cstring_to_str<'a>(cstring: &'a *const c_char) -> Result<&str, CoreFailure> {
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

pub unsafe fn create_byte_buffer(bytes: Vec<u8>) -> CByteBuffer {
    let slice = bytes.into_boxed_slice();
    CByteBuffer { length: slice.len() as c_uint, data: Box::into_raw(slice) as *mut u8 }
}
