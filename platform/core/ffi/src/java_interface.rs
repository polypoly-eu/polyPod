use common::serialization::{message_pack_deserialize, message_pack_serialize};
use core_failure::CoreFailure;
use crate::rdf_result_conversion::{bytes_to_string, to_json_bytes};
use jni::{
    objects::{GlobalRef, JClass, JObject, JString, JValue},
    sys::jbyteArray,
    JNIEnv, JavaVM,
};
use lib::core::{self, PlatformRequest, PlatformResponse};

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

/// Loads feature categories from the given features dir.
/// - args: Function arguments as MessagePack value.
/// Returns a Result<Vec<FeatureCategory>, CoreFailure> represent as MessagePack value.
#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_loadFeatureCategories(
    env: JNIEnv,
    _: JClass,
    args: jbyteArray,
) -> jbyteArray {
    fn load_feature_categories(
        env: JNIEnv,
        args: jbyteArray,
    ) -> Result<Vec<core::feature_categories::FeatureCategory>, CoreFailure> {
        let bytes = env
            .convert_byte_array(args)
            .map_err(|err| CoreFailure::failed_to_extract_bytes(err.to_string()))?;
        core::load_feature_categories(message_pack_deserialize(bytes)?)
    }
    env.byte_array_from_slice(&message_pack_serialize(load_feature_categories(env, args)))
        .unwrap()
}

/// Notify that app did become inactive.
/// Returns Result<(), CoreFailure> as MessagePack value.
#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_appDidBecomeInactive(
    env: JNIEnv,
    _: JClass,
) -> jbyteArray {
    env.byte_array_from_slice(&message_pack_serialize(core::app_did_become_inactive()))
        .unwrap()
}

/// Ask if user session is expired.
/// Returns Result<bool, CoreFailure> as MessagePack value.
#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_isUserSessionExpired(
    env: JNIEnv,
    _: JClass,
) -> jbyteArray {
    env.byte_array_from_slice(&message_pack_serialize(core::is_user_session_expired()))
        .unwrap()
}

/// Set the user session timeout option to a given one.
/// - option: Timeout Option as MessagePack value.
/// Returns Result<(), CoreFailure> as MessagePack value.
#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_setUserSessionTimeoutOption(
    env: JNIEnv,
    _: JClass,
    option: jbyteArray,
) -> jbyteArray {
    fn set_timeout_option(env: JNIEnv, option: jbyteArray) -> Result<(), CoreFailure> {
        let bytes = env
            .convert_byte_array(option)
            .map_err(|err| CoreFailure::failed_to_extract_bytes(err.to_string()))?;
        core::set_user_session_timeout_option(message_pack_deserialize(bytes)?)
    }
    env.byte_array_from_slice(&message_pack_serialize(set_timeout_option(env, option)))
        .unwrap()
}

/// Get the currently configured user session timeout option.
/// Returns Result<TimeoutOption, CoreFailure> as MessagePack value.
#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_getUserSessionTimeoutOption(
    env: JNIEnv,
    _: JClass,
) -> jbyteArray {
    env.byte_array_from_slice(&message_pack_serialize(
        core::get_user_session_timeout_option(),
    ))
    .unwrap()
}

/// Get the user session timeout config options.
/// Returns Result<Vec<UserSessionTimeout>, CoreFailure> as MessagePack value.
#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_getUserSessionTimeoutOptionsConfig(
    env: JNIEnv,
    _: JClass,
) -> jbyteArray {
    env.byte_array_from_slice(&message_pack_serialize(
        core::get_user_session_timeout_options_config(),
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
    fn perform_request(&self, request: PlatformRequest) -> Result<PlatformResponse, CoreFailure> {
        let result: Result<PlatformResponse, CoreFailure> = match self
            .java_vm
            .attach_current_thread()
        {
            Ok(env) => {
                let request_byte_array = env
                    .byte_array_from_slice(&message_pack_serialize(request))
                    .map_err(|err| CoreFailure::failed_to_convert_bytes(err.to_string()))?;

                let response_byte_array_as_jvalue = env
                    .call_method(
                        self.callback.as_obj(),
                        "performRequest",
                        "([B)[B",
                        &[JValue::Object(JObject::from(request_byte_array))],
                    )
                    .map_err(|err| CoreFailure::failed_to_call_jni_method(err.to_string()))?;

                let response_byte_array = response_byte_array_as_jvalue
                    .l()
                    .map_err(|err| CoreFailure::failed_to_extract_jobject(err.to_string()))?
                    .into_inner();

                let response_bytes: Vec<u8> = env
                    .convert_byte_array(response_byte_array)
                    .map_err(|err| CoreFailure::failed_to_extract_bytes(err.to_string()))?;

                message_pack_deserialize(response_bytes)?
            }
            Err(e) => {
                error!("Rust:java_interface => attach_current_thread:Err => Couldn't get env::");
                Err(CoreFailure::failed_to_attach_jvm(e.to_string()))
            }
        };

        if result.is_err() {
            let err = result.err().unwrap();
            error!(
                "Rust:java_interface:perform_request => result:Err {}",
                err.message
            );
            return Err(err);
        } else {
            return result;
        }
    }
}

#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_execRdfQuery(
    env: JNIEnv,
    _: JClass,
    query: JString,
) -> jbyteArray {
    env.byte_array_from_slice(&message_pack_serialize(
        read_jni_string(&env, query)
            .and_then(core::exec_rdf_query)
            .and_then(to_json_bytes)
            .and_then(bytes_to_string),
    ))
    .unwrap()
}

#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_execRdfUpdate(
    env: JNIEnv,
    _: JClass,
    query: JString,
) -> jbyteArray {
    env.byte_array_from_slice(&message_pack_serialize(
        read_jni_string(&env, query).and_then(core::exec_rdf_update),
    ))
    .unwrap()
}
