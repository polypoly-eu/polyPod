// use crate::{
//     feature_manifest_parsing::{JSONFeatureManifest, FeatureManifestParsingError},
//     kernel::Kernel,
//     kernel::KERNEL,
// };
// use serde::Serialize;
use std::{
    ffi::{CStr, CString},
    os::raw::c_char,
    str::Utf8Error,
};

use flatbuffers::FlatBufferBuilder;

use crate::{kernel::Kernel, failure_generated::failure::{FailureArgs, FailureCode, Failure}, kernel_bootstrap_response_generated::kernel_bootstrap_response::{KernelBootstrapResponseArgs, KernelBootstrapResponse, finish_kernel_bootstrap_response_buffer}};

/// # Safety
/// This function can be unsafe if the language_code pointer is null or the string is in wrong format.
///
/// Bootstrap the kernel with the given configuration:
/// - language_code: User's locale language code
/// Returns the result JSON of either success or failure to bootstrap the kernel
#[no_mangle]
pub unsafe extern "C" fn kernel_bootstrap(language_code: *const c_char) -> *const u8 {
    let mut fbb = FlatBufferBuilder::new();

    let failure = match cstring_to_str(&language_code).map(String::from) {
        Ok(language_code) => {
            match Kernel::bootstrap(language_code) {
                Ok(_) => None,
                Err(message) => {
                    let args = FailureArgs {
                        code: FailureCode::FailedToBootstrapKernel,
                        message: Some(fbb.create_string(message.as_str())),
                    };
                    Some(Failure::create(&mut fbb, &args))
                }
            }
        },
        Err(message) => {
            let args = FailureArgs {
                code: FailureCode::FailedToBootstrapKernel,
                message: Some(fbb.create_string(message.as_str())),
            };
            Some(Failure::create(&mut fbb, &args))
        }
    };

    let bootstrap_response_args = KernelBootstrapResponseArgs {
        failure: failure,
    };
    let response = KernelBootstrapResponse::create(&mut fbb, &bootstrap_response_args);
    finish_kernel_bootstrap_response_buffer(&mut fbb, response);
    fbb.finished_data().to_owned().as_ptr()
}

// /// # Safety
// /// This function can be unsafe if the json pointer is null or the string is in wrong format.
// ///
// /// Parse the feature manifest from a given JSON.
// /// Returns the JSON with the parsed feature manifest by taking into account the user's locale language code.
// ///
// /// This is unfortunate at the moment that this API gets a JSON and responds back with a JSON. Ideally the kernel
// /// would be able to read all the features from the disk on its own and return back a JSON with all of the features.
// /// It was choosen to return back to platform code a JSON, as composing complex C model is not nice. For example
// /// Rust's HashMap cannot be directly mapped to C, and instead of working with Opaque types and pointers to access data from a hashmap - use the JSON.
// /// The JSON would allow to easily represent any complex data model in a standard way.
// ///
// /// This API would be an example of any further API that will be added. That is - the API would respond back with a JSON
// /// containing the result of the operation with any meaningfull payload or error code/message.
// #[no_mangle]
// // pub unsafe extern "C" fn parse_feature_manifest(json: *const c_char) -> *const c_char {
// //     unsafe fn parse_manifest(json: *const c_char) -> Result<JSONFeatureManifest, KernelError> {
// //         let kernel = get_kernel()?;
// //         let json = cstring_to_str(&json)?;
// //         kernel
// //             .parse_feature_manifest(json)
// //             .map_err(KernelError::FailedToParseFeatureManifest)
// //     }
// //     to_result_str(parse_manifest(json))
// // }

// fn get_kernel() -> Result<&'static Kernel, KernelError> {
//     match KERNEL.get() {
//         Some(kernel) => Ok(kernel),
//         None => Err(KernelError::KernelNotBootstraped),
//     }
// }

// Disabled the clippy false positive, https://github.com/rust-lang/rust-clippy/issues/5787
#[allow(clippy::needless_lifetimes)]
unsafe fn cstring_to_str<'a>(cstring: &'a *const c_char) -> Result<&str, String> {
    if cstring.is_null() {
        return Err("Null c string pointer".to_owned());
    }

    CStr::from_ptr(*cstring)
        .to_str()
        .map_err(|_| "Failed to create CStr".to_owned())
}