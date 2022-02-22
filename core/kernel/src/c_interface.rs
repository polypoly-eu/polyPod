use crate::{
    feature_manifest::{FeatureManifest, FeatureManifestParsingError},
    kernel::Kernel,
    kernel::KERNEL,
};
use serde::Serialize;
use std::{
    ffi::{CStr, CString},
    os::raw::c_char,
    str::Utf8Error,
};

/// # Safety
/// This function can be unsafe if the language_code pointer is null or the string is in wrong format.
///
/// Bootstrap the kernel with the given configuration:
/// - language_code: User's locale language code
/// Returns the result JSON of either success or failure to bootstrap kernel
#[no_mangle]
pub unsafe extern "C" fn kernel_bootstrap(language_code: *const c_char) -> *const c_char {
    unsafe fn bootstrap(language_code: *const c_char) -> Result<(), KernelError> {
        let language_code = cstring_to_str(&language_code).map(String::from)?;
        Kernel::bootstrap(language_code).map_err(KernelError::FailedToBootstrapKernel)
    }

    to_result_str(bootstrap(language_code))
}

/// # Safety
/// This function can be unsafe if the json pointer is null or the string is in wrong format.
///
/// Parse the feature manifest from a given JSON.
/// Returns the JSON with the parsed feature manifest by taking into account the user's locale language code.
///
/// This is unfortunate at the moment that this API gets a JSON and responds back with a JSON. Ideally the kernel
/// would be able to read all features from the disk on its own and return a JSON with all of the features.
/// It was choosen to return back to platform code a JSON, as composing complex C model is not nice. For example
/// for feature manifest we would have to implement/bring in the functionality of the HashMap. The JSON would allow
/// to easily represent any complex data model in a standard way.
#[no_mangle]
pub unsafe extern "C" fn parse_feature_manifest(json: *const c_char) -> *const c_char {
    unsafe fn parse_manifest(json: *const c_char) -> Result<FeatureManifest, KernelError> {
        let kernel = get_kernel()?;
        let json = cstring_to_str(&json)?;
        kernel
            .parse_feature_manifest(json)
            .map_err(KernelError::FailedToParseFeatureManifest)
    }
    to_result_str(parse_manifest(json))
}

fn get_kernel() -> Result<&'static Kernel, KernelError> {
    match KERNEL.get() {
        Some(kernel) => Ok(kernel),
        None => Err(KernelError::KernelNotBootstraped),
    }
}

// Disabled the clippy false positive, https://github.com/rust-lang/rust-clippy/issues/5787
#[allow(clippy::needless_lifetimes)]
unsafe fn cstring_to_str<'a>(cstring: &'a *const c_char) -> Result<&str, KernelError> {
    if cstring.is_null() {
        return Err(KernelError::NullCString);
    }

    CStr::from_ptr(*cstring)
        .to_str()
        .map_err(KernelError::FailedToCreateCStr)
}

/// Kernel operations result, which is to be returned to clients.
#[derive(Serialize)]
enum KernelResult<T: Serialize> {
    Success(T),
    Failure(KernelFailure),
}

#[derive(Serialize)]
struct KernelFailure {
    code: u16,
    message: String,
}

enum KernelError {
    NullCString,
    FailedToParseFeatureManifest(FeatureManifestParsingError),
    FailedToCreateCStr(Utf8Error),
    FailedToBootstrapKernel(String),
    KernelNotBootstraped,
}

impl KernelError {
    fn code(&self) -> u16 {
        match self {
            Self::NullCString => 1,
            Self::FailedToParseFeatureManifest(_) => 2,
            Self::FailedToCreateCStr(_) => 3,
            Self::FailedToBootstrapKernel(_) => 4,
            Self::KernelNotBootstraped => 5,
        }
    }

    fn message(&self) -> String {
        match self {
            Self::NullCString => String::from("cstring is null."),
            Self::FailedToParseFeatureManifest(err) => err.description.clone(),
            Self::FailedToCreateCStr(err) => err.to_string(),
            Self::FailedToBootstrapKernel(error) => error.to_owned(),
            Self::KernelNotBootstraped => String::from("Kernel is not bootstraped."),
        }
    }
}

fn to_result_str<T: Serialize>(result: Result<T, KernelError>) -> *const c_char {
    let kernel_result = match result {
        Ok(success) => KernelResult::Success(success),
        Err(e) => KernelResult::Failure(KernelFailure {
            code: e.code(),
            message: e.message(),
        }),
    };

    let kernel_result_string = serde_json::to_string(&kernel_result).unwrap();

    CString::new(kernel_result_string).unwrap().into_raw()
}
