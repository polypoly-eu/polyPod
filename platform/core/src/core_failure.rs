use crate::flatbuffers_generated::failure_generated::FailureCode;

#[derive(Debug, Clone)]
pub struct CoreFailure {
    pub code: FailureCode,
    pub message: String,
}

impl CoreFailure {
    pub fn core_bootstrap_failed() -> Self {
        CoreFailure {
            code: FailureCode::FailedToBootstrapCore,
            message: "Core was already initialized".to_string(),
        }
    }

    pub fn core_not_bootstraped() -> Self {
        CoreFailure {
            code: FailureCode::CoreNotBootstraped,
            message: "Core was not initialized".to_string(),
        }
    }

    pub fn failed_to_parse_feature_manifest(message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToParseFeatureManifest,
            message,
        }
    }

    pub fn null_c_string_pointer() -> Self {
        CoreFailure {
            code: FailureCode::NullCStringPointer,
            message: "cstring pointer is null.".to_string(),
        }
    }

    pub fn failed_to_create_c_str(message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToCreateCString,
            message,
        }
    }

    pub fn failed_to_extract_java_string(message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToExtractJavaString,
            message: message
        }
    }

    pub fn failed_to_convert_java_string(message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToConvertJavaString,
            message: message,
        }
    }
}
