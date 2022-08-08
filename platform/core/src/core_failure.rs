use serde::Serialize;
use url::Url;

#[cfg(target_os = "android")]
use crate::rdf_failure::RdfFailure;

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
    FailedFileSystemOperation,
    FailedToParseURL,
    FailedToUnzip,
    FailedToCreateFeatureFilesPath,
    FailedToConvertToFsPath,
    FailedToConvertToResourceUrl,
    FailedToGetFilePath,
    FailedToGetLastSegmentFromUrl,
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
    pub fn map_rdf_to_core_failure(error: RdfFailure) -> Self {
        CoreFailure {
            code: error.code,
            message: error.message 
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
            message: format!(
                "Failed to read file from path '{}', error: '{}'",
                path, message,
            ),
        }
    }

    pub fn failed_file_system_operation(path: String, message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedFileSystemOperation.value(),
            message: format!(
                "File system failed for path '{}' with error: '{}'",
                path, message,
            ),
        }
    }

    pub fn failed_to_parse_url(url: String, message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToParseURL.value(),
            message: format!("Failed to parse url '{}' with error: '{}'", url, message,),
        }
    }

    pub fn failed_to_unzip(url: String, message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToUnzip.value(),
            message: format!(
                "Failed to unzip resource at url '{}' with error: '{}'",
                url, message,
            ),
        }
    }

    pub fn failed_to_create_feature_files_path(message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToCreateFeatureFilesPath.value(),
            message: format!(
                "Failed to create feature files path with error: '{}'",
                message,
            ),
        }
    }

    pub fn failed_to_convert_to_fs_path_from_resource_url(url: String, message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToConvertToFsPath.value(),
            message: format!(
                "Failed to create fs path from resource url {} with error: '{}'",
                url, message,
            ),
        }
    }

    pub fn failed_to_convert_to_resource_url_from_fs_path(url: String, message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToConvertToResourceUrl.value(),
            message: format!(
                "Failed to create fs path from resource url {} with error: '{}'",
                url, message,
            ),
        }
    }

    pub fn failed_to_get_file_path(url: Url, message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToGetFilePath.value(),
            message: format!(
                "Failed to get file path from url {} with error: '{}'",
                url, message,
            ),
        }
    }

    pub fn failed_to_get_last_segment_from_url(url: Url, message: String) -> Self {
        CoreFailure {
            code: FailureCode::FailedToGetLastSegmentFromUrl.value(),
            message: format!(
                "Failed to get last segment from url {} with error: '{}'",
                url, message,
            ),
        }
    }
}
