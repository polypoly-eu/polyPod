#![cfg(target_os = "android")]
#![allow(non_snake_case)]

use crate::{
    android_interface::utils::read_jni_string,
    core::{bootstrap, parse_feature_manifest},
    flatbuffers_mapping::{
        core_bootstrap_fbs_mapping::build_core_bootstrap_response,
        feature_manifest_fbs_mapping::build_feature_manifest_parsing_response,
    },
};

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
    env.byte_array_from_slice(&build_core_bootstrap_response(
        read_jni_string(&env, language_code)
            .map(String::from)
            .and_then(bootstrap),
    ))
    .unwrap()
}

/// Parse the given feature maniest json.
/// - json: Feature manifest json string to be parsed.
/// Returns a flatbuffer byte array with feature_manifest_response.
#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_parseFeatureManifest(
    env: JNIEnv,
    _: JClass,
    json: JString,
) -> jbyteArray {
    env.byte_array_from_slice(&build_feature_manifest_parsing_response(
        read_jni_string(&env, json).and_then(|string| parse_feature_manifest(&string)),
    ))
    .unwrap()
}
