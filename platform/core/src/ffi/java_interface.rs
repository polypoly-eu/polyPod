use crate::core::bootstrap;
use crate::core::{exec_rdf_query, exec_rdf_update};
use crate::core::load_feature_categories;
use crate::core::{self, PlatformRequest, PlatformResponse};
use crate::core_failure::CoreFailure;
use crate::ffi::{deserialize, serialize};
use jni::{
    objects::{GlobalRef, JClass, JObject, JString, JValue},
    sys::jbyteArray,
    JNIEnv, JavaVM,
};

use log::error;

/// Bootstrap core with the given configuration:
/// - language_code: User's locale language code.
/// Returns a flatbuffer byte array with core_bootstrap_response.
#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_bootstrapCore(
    env: JNIEnv,
    _: JClass,
    language_code: JString,
    callback: JObject,
) -> jbyteArray {
    let bridge = BridgeToPlatform {
        callback: env.new_global_ref(callback).unwrap(),
        java_vm: env.get_java_vm().unwrap(),
    };
    env.byte_array_from_slice(&serialize(
        read_jni_string(&env, language_code)
            .map(String::from)
            .and_then(|language_code| bootstrap(language_code, Box::new(bridge))),
    ))
    .unwrap()
}

struct BridgeToPlatform {
    // The callback passed from Android is a local reference: only valid during the method call.
    // To store it, we need to put it in a global reference.
    // See https://developer.android.com/training/articles/perf-jni#local-and-global-references
    callback: GlobalRef,

    // We need JNIEnv to call the callback.
    // JNIEnv is valid only in the same thread, so we have to store the vm instead, and use it to get
    // a JNIEnv for the current thread.
    // See https://developer.android.com/training/articles/perf-jni#javavm-and-jnienvb
    java_vm: JavaVM,
}

impl core::PlatformHookRequest for BridgeToPlatform {
    fn perform_request(&self, request: PlatformRequest) -> Result<PlatformResponse, String> {
        let result: Result<PlatformResponse, String> = match self.java_vm.attach_current_thread() {
            Ok(env) => {
                let request_byte_array = env
                    .byte_array_from_slice(&serialize(request))
                    .map_err(|err| err.to_string())?;

                let response_byte_array_as_jvalue = env
                    .call_method(
                        self.callback.as_obj(),
                        "performRequest",
                        "([B)[B",
                        &[JValue::Object(JObject::from(request_byte_array))],
                    )
                    .map_err(|err| err.to_string())?;

                let response_byte_array = response_byte_array_as_jvalue
                    .l()
                    .map_err(|err| err.to_string())?
                    .into_inner();

                let response_bytes: Vec<u8> = env
                    .convert_byte_array(response_byte_array)
                    .map_err(|err| err.to_string())?;

                let deserialized: Result<PlatformResponse, String> = deserialize(response_bytes)?;
                deserialized
            }
            Err(e) => {
                error!("Rust:java_interface => attach_current_thread:Err => Couldn't get env::");
                Err(e.to_string())
            }
        };

        if result.is_err() {
            let err = result.err().unwrap();
            error!("Rust:java_interface:perform_request => result:Err {}", err);
            return Err(err);
        } else {
            return result;
        }
    }
}

/// Loads feature categories from the given features dir.
/// - featuresDir: Path to directory where features are stored.
/// Returns a Result<Vec<FeatureCategory>, CoreFailure> represent as MessagePack value.
#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_loadFeatureCategories(
    env: JNIEnv,
    _: JClass,
    featuresDir: JString,
) -> jbyteArray {
    env.byte_array_from_slice(&serialize(
        read_jni_string(&env, featuresDir).and_then(|string| load_feature_categories(&string)),
    ))
    .unwrap()
}

#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_execRdfQuery(
    env: JNIEnv,
    _: JClass,
    query: JString,
    appPath: JString
) -> jbyteArray {
    env.byte_array_from_slice(&serialize(
        read_jni_string(&env, query)
        .and_then(
            |queryString| 
            read_jni_string(&env, appPath)
            .and_then(|appPathString| exec_rdf_query(queryString, appPathString))
        ),
    ))
    .unwrap()
}

#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_execRdfUpdate(
    env: JNIEnv,
    _: JClass,
    query: JString,
    appPath: JString
) -> jbyteArray {
    env.byte_array_from_slice(&serialize(
        read_jni_string(&env, query)
        .and_then(
            |queryString| 
            read_jni_string(&env, appPath)
            .and_then(|appPathString| exec_rdf_update(queryString, appPathString))
        ),
    ))
    .unwrap()
}

fn read_jni_string(env: &JNIEnv, field: JString) -> Result<String, CoreFailure> {
    env.get_string(field)
        .map_err(|err| CoreFailure::failed_to_extract_java_string(err.to_string()))
        .and_then(|java_string| {
            java_string
                .to_str()
                .map(String::from)
                .map_err(|err| CoreFailure::failed_to_convert_java_string(err.to_string()))
        })
}
