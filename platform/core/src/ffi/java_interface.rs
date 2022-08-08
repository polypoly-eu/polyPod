use crate::common::serialization::{message_pack_deserialize, message_pack_serialize};
use crate::core::{self, PlatformRequest, PlatformResponse};
use crate::core_failure::CoreFailure;
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
    fs_root: JString,
    callback: JObject,
) -> jbyteArray {
    fn bootstrap(
        env: JNIEnv,
        language_code: JString,
        fs_root: JString,
        plaftorm_bridge: BridgeToPlatform,
    ) -> Result<(), CoreFailure> {
        let language_code = String::from(read_jni_string(&env, language_code)?);
        let fs_root = String::from(read_jni_string(&env, fs_root)?);
        core::bootstrap(language_code, fs_root, Box::new(plaftorm_bridge))
    }

    let bridge = BridgeToPlatform {
        callback: env.new_global_ref(callback).unwrap(),
        java_vm: env.get_java_vm().unwrap(),
    };

    env.byte_array_from_slice(&message_pack_serialize(bootstrap(
        env,
        language_code,
        fs_root,
        bridge,
    )))
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
                    .byte_array_from_slice(&message_pack_serialize(request))
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

                message_pack_deserialize(response_bytes).map_err(|err| err.message)?
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
    env.byte_array_from_slice(&message_pack_serialize(
        read_jni_string(&env, featuresDir)
            .and_then(|string| core::load_feature_categories(&string)),
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
