use crate::core_failure::CoreFailure;

use jni::{
    objects::{JString},
    JNIEnv
};

pub fn read_jni_string(env: &JNIEnv, field: JString) -> Result<String,CoreFailure> {
    env
    .get_string(field)
    .map_err(|err| CoreFailure::failed_to_extract_java_string(err.to_string()))
    .and_then(|java_string| 
        java_string
            .to_str()
            .map(String::from)
            .map_err(|err| CoreFailure::failed_to_convert_java_string(err.to_string()))
    )
}