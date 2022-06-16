#[derive(Debug, Clone)]
pub enum FailureCode {
    CoreNotBootstrapped = 1,
    CoreAlreadyBootstrapped,
    FailedToParseFeatureManifest,
    NullCStringPointer,
    FailedToCreateCString,
    FailedToExtractJavaString,
    FailedToConvertJavaString,
}

#[derive(Debug, Clone)]
pub struct CoreFailure {
    pub code: FailureCode,
    pub message: String,
}

impl CoreFailure {
    pub fn core_already_bootstrapped() -> Self {
        CoreFailure {
            code: FailureCode::CoreAlreadyBootstrapped,
            message: "Core was already initialized".to_string(),
        }
    }

    pub fn core_not_bootstrapped() -> Self {
        CoreFailure {
            code: FailureCode::CoreNotBootstrapped,
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

    #[cfg(target_os = "android")]
    pub fn failed_to_extract_java_string(message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToExtractJavaString,
            message,
        }
    }

    #[cfg(target_os = "android")]
    pub fn failed_to_convert_java_string(message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToConvertJavaString,
            message,
        }
    }
}
