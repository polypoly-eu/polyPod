use crate::core::bootstrap;
use crate::core::load_feature_categories;
use crate::core::{self, NativeRequest, NativeResponse};
use crate::core_failure::CoreFailure;
use crate::ffi::{deserialize, serialize};
use jni::{
    objects::{GlobalRef, JClass, JObject, JString, JValue},
    sys::{jbyteArray, jint, jlong, jstring},
    JNIEnv, JavaVM,
};

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
    let bridge = BridgeToNative {
        callback: env.new_global_ref(callback).unwrap(),
        java_vm: env.get_java_vm().unwrap(),
    };
    env.byte_array_from_slice(&serialize(
        read_jni_string(&env, language_code)
            .map(String::from)
            .and_then(|language_code| core::bootstrap(language_code, Box::new(bridge))),
    ))
    .unwrap()
}

struct BridgeToNative {
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

impl core::PlatformHookRequest for BridgeToNative {
    fn perform_request(&self, request: NativeRequest) -> Result<NativeResponse, String> {
        return match self.java_vm.attach_current_thread() {
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
                deserialize(response_bytes)
            }
            // The Android LogCat will not show this, but for consistency or testing with non-Android JNI.
            // Note that if we panic, LogCat will also not show a message, or location.
            // TODO consider writing to file. Otherwise it's impossible to notice this.
            Err(e) => {
                println!("Couldn't get env::",);
                Err(e.to_string())
            }
        };
    }
}

#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_native(
    env: JNIEnv,
    _class: JClass,
    n: jint,
    callback: JObject,
) {
    env.call_method(callback, "methodB", "(I)V", &[1.into()])
        .unwrap();
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

// pub struct BridgeToNative {
//     env: JNIEnv,
// }

// /*
// jclass testClass = (*env) -> FindClass(env, "test/Test");
// jmethodID methodB = (*env) -> GetStaticMethodID(env, testClass, "methodB", "()V");
// (*env) -> CallStaticVoidMethod(env, testClass, methodB, NULL);
// */
// impl core::PlatformHookRequest for BridgeToNative {
//     fn perform_request(
//         &self,
//         request: core::NativeRequest,
//     ) -> Result<core::NativeResponse, String> {
//         let class = self.env.find_class("coop/polypoly/core/JniApi").unwrap();
//         let result = class.call_static_method(class, "methodB", "()V", &[]);

//         let request_byte_buffer = unsafe { create_byte_buffer(serialize(request)) };
//         let response_byte_buffer = (self.perform_request)(request_byte_buffer);
//         let response: Result<NativeResponse, String> =
//             unsafe { deserialize(byte_buffer_to_bytes(&response_byte_buffer)) };
//         // match &response {
//         //     Ok(value) => match value {
//         //         NativeResponse::FeatureName(name) => {
//         //             let x = name.to_owned();
//         //             print!("");
//         //         }
//         //     },
//         //     Err(err) => {
//         //         let x = err.to_owned();
//         //         print!("");
//         //     }
//         // };
//         (self.free_bytes)(response_byte_buffer.data);
//         return response;
//     }
// }

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
