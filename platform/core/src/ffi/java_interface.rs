use crate::core::bootstrap;
use crate::core::parse_feature_manifest;
use crate::core::{exec_rdf_query, exec_rdf_update};
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

/// Parse the given feature maniest json.
/// - json: Feature manifest json string to be parsed.
/// Returns a flatbuffer byte array with feature_manifest_response.
#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_parseFeatureManifest(
    env: JNIEnv,
    _: JClass,
    json: JString,
) -> jbyteArray {
    env.byte_array_from_slice(&serialize(
        read_jni_string(&env, json).and_then(|string| parse_feature_manifest(&string)),
    ))
    .unwrap()
}

#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_execRdfQuery(
    env: JNIEnv,
    _: JClass,
    query: JString,
) -> jbyteArray {
    env.byte_array_from_slice(&serialize(
        read_jni_string(&env, query).and_then(|string| exec_rdf_query(string)),
    ))
    .unwrap()
}

#[no_mangle]
pub extern "system" fn Java_coop_polypoly_core_JniApi_execRdfUpdate(
    env: JNIEnv,
    _: JClass,
    query: JString,
) -> jbyteArray {
    env.byte_array_from_slice(&serialize(
        read_jni_string(&env, query).and_then(|string| exec_rdf_update(string)),
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
