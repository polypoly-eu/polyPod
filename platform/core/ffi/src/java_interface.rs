use common::serialization::{message_pack_deserialize, message_pack_serialize};
use core_failure::CoreFailure;
use jni::{
    objects::{GlobalRef, JClass, JObject, JValue},
    sys::jbyteArray,
    JNIEnv, JavaVM,
};
use lib::bootstrap::bootstrap;
use lib::core_request::{self};
use lib::platform_request::{PlatformCallback, PlatformRequest};
use log::error;

/// Bootstrap core with the given configuration:
/// - language_code: User's locale language code.
/// Returns a MessagePack byte array with core_bootstrap_response.
#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_bootstrapCore(
    env: JNIEnv,
    _: JClass,
    args: jbyteArray,
    callback: JObject,
) -> jbyteArray {
    let bridge = BridgeToPlatform {
        callback: env.new_global_ref(callback).unwrap(),
        java_vm: env.get_java_vm().unwrap(),
    };

    env.byte_array_from_slice(&message_pack_serialize(
        get_bytes(env, args)
            .and_then(message_pack_deserialize)
            .and_then(|args| bootstrap(args, Box::new(bridge))),
    ))
    .unwrap()
}

/// Loads feature categories from the given features dir.
/// - args: Function arguments as MessagePack value.
/// Returns a Result<Vec<FeatureCategory>, CoreFailure> represent as MessagePack value.
#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_executeRequest(
    env: JNIEnv,
    _: JClass,
    request: jbyteArray,
) -> jbyteArray {
    env.byte_array_from_slice(
        &(match get_bytes(env, request).and_then(message_pack_deserialize) {
            Ok(request) => core_request::execute_request(request),
            Err(err) => message_pack_serialize(Err::<(), _>(err)),
        }),
    )
    .unwrap()
}

fn get_bytes(env: JNIEnv, byte_array: jbyteArray) -> Result<Vec<u8>, CoreFailure> {
    env.convert_byte_array(byte_array)
        .map_err(|err| CoreFailure::failed_to_extract_bytes(err.to_string()))
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

impl PlatformCallback for BridgeToPlatform {
    fn perform_request(&self, request: PlatformRequest) -> Result<Vec<u8>, CoreFailure> {
        let result: Result<Vec<u8>, CoreFailure> = match self.java_vm.attach_current_thread() {
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

                env.convert_byte_array(response_byte_array)
                    .map_err(|err| CoreFailure::failed_to_extract_bytes(err.to_string()))
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
