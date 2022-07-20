use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub enum FailureCode {
    CoreNotBootstrapped = 1,
    CoreAlreadyBootstrapped,
    FailedToParseFeatureManifest,
    NullCStringPointer,
    FailedToCreateCString,
    FailedToExtractJavaString,
    FailedToConvertJavaString,
    FailedToParseFeatureCategoriesJSON,
    FailedToReadFile,
}

impl FailureCode {
    fn value(&self) -> i32 {
        (*self).clone() as i32
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct CoreFailure {
    pub code: i32,
    pub message: String,
}

impl CoreFailure {
    pub fn core_already_bootstrapped() -> Self {
        CoreFailure {
            code: FailureCode::CoreAlreadyBootstrapped.value(),
            message: "Core was already initialized".to_string(),
        }
    }

    pub fn core_not_bootstrapped() -> Self {
        CoreFailure {
            code: FailureCode::CoreNotBootstrapped.value(),
            message: "Core was not initialized".to_string(),
        }
    }

    pub fn failed_to_parse_feature_manifest(message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToParseFeatureManifest.value(),
            message,
        }
    }

    pub fn null_c_string_pointer() -> Self {
        CoreFailure {
            code: FailureCode::NullCStringPointer.value(),
            message: "cstring pointer is null.".to_string(),
        }
    }

    pub fn failed_to_create_c_str(message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToCreateCString.value(),
            message,
        }
    }

    #[cfg(target_os = "android")]
    pub fn failed_to_extract_java_string(message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToExtractJavaString.value(),
            message,
        }
    }

    #[cfg(target_os = "android")]
    pub fn failed_to_convert_java_string(message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToConvertJavaString.value(),
            message,
        }
    }
    
    pub fn failed_to_decode_feature_categories_json(message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToParseFeatureCategoriesJSON.value(),
            message,
        }
    }

    pub fn failed_to_read_contents_of_file(path: String, message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToReadFile.value(),
            message: format!("Failed to read file from path '{}', error: '{}'", path, message),
        }
    }
}
