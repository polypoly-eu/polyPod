use crate::core;
use crate::core_failure::CoreFailure;
use crate::common::serialization::message_pack_serialize; 
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
    fs_root: JString,
) -> jbyteArray {
    fn bootstrap(
        env: JNIEnv,
        language_code: JString,
        fs_root: JString,
    ) -> Result<(), CoreFailure> {
        let language_code = String::from(read_jni_string(&env, language_code)?);
        let fs_root = String::from(read_jni_string(&env, fs_root)?);
        core::bootstrap(language_code, fs_root)
    }
    env.byte_array_from_slice(&message_pack_serialize(
        bootstrap(env, language_code, fs_root)
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
    env.byte_array_from_slice(&message_pack_serialize(
        read_jni_string(&env, featuresDir).and_then(|string| core::load_feature_categories(&string)),
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
