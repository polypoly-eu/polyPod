use crate::flatbuffers_generated::failure_generated::failure::FailureCode;

#[derive(Debug)]
pub struct KernelFailure {
    pub code: FailureCode,
    pub message: String,
}

impl KernelFailure {
    pub fn kernel_bootstrap_failed() -> Self {
        KernelFailure {
            code: FailureCode::FailedToBootstrapKernel,
            message: "Kernel was already initialized".to_string(),
        }
    }

    pub fn kernel_not_bootstraped() -> Self {
        KernelFailure {
            code: FailureCode::KernelNotBootstraped,
            message: "Kernel was not initialized".to_string(),
        }
    }

    pub fn failed_to_parse_feature_manifest(message: String) -> Self {
        KernelFailure {
            code: FailureCode::FailedToParseFeatureManifest,
            message,
        }
    }

    pub fn null_c_string_pointer() -> Self {
        KernelFailure {
            code: FailureCode::NullCStringPointer,
            message: "cstring pointer is null.".to_string(),
        }
    }

    pub fn failed_to_create_c_str(message: String) -> Self {
        KernelFailure {
            code: FailureCode::FailedToCreateCString,
            message,
        }
    }
}
