use crate::feature_manifest::{FeatureManifest, FeatureManifestParsingError, JSONStr};
use once_cell::sync::OnceCell;

/// Kernel is held as a singleton.
pub static KERNEL: OnceCell<Kernel> = OnceCell::new();

/// The Kernel would act as a composition root, containing any global configuration
/// to be shared between components, as well managing components life time.
pub struct Kernel {
    language_code: String,
}

impl Kernel {
    pub fn bootstrap(language_code: String) -> Result<(), String> {
        if KERNEL.get().is_some() {
            return Err("Kernel was already initialized".to_string());
        }

        let kernel = Kernel { language_code };

        KERNEL
            .set(kernel)
            .map_err(|_| "Failed to initialize Kernel".to_string())
    }

    pub fn parse_feature_manifest(
        &self,
        json: &JSONStr,
    ) -> Result<FeatureManifest, FeatureManifestParsingError> {
        FeatureManifest::parse(json, &self.language_code)
    }
}
