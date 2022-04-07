use crate::core_failure::CoreFailure;

use jni::{
    objects::{JString},
    JNIEnv
};

pub fn read_jni_string<'a>(env: &'a JNIEnv<'a>, field: JString<'a>) -> Result<&'a str,CoreFailure> {
    env
    .get_string(field)
    .map_err(|err| CoreFailure::failed_to_extract_java_string(err.to_string()))
    .and_then(|java_string| 
        java_string
            .borrow()
            .to_str()
            .map_err(|err| CoreFailure::failed_to_convert_java_string(err.to_string()))
    )
}