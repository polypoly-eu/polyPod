use crate::core::bootstrap;
use crate::core::load_feature_categories;
use crate::core_failure::CoreFailure;
use crate::ffi::serialize;
use jni::{
    objects::{JClass, JString},
    sys::jbyteArray,
    JNIEnv,
};

/// Bootstrap core with the given configuration:
/// - language_code: User's locale language code.
/// Returns a flatbuffer byte array with core_bootstrap_response.
#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_bootstrapCore(
    env: JNIEnv,
    _: JClass,
    language_code: JString,
) -> jbyteArray {
    env.byte_array_from_slice(&serialize(
        read_jni_string(&env, language_code)
            .map(String::from)
            .and_then(bootstrap),
    ))
    .unwrap()
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
