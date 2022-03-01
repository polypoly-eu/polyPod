use crate::{feature_manifest_parsing::{FeatureManifest, JSONStr}, kernel_failure::KernelFailure};
use once_cell::sync::OnceCell;

/// Kernel is held as a singleton.
pub static KERNEL: OnceCell<Kernel> = OnceCell::new();

/// The Kernel would act as a composition root, containing any global configuration
/// to be shared between components, as well managing components life time.
pub struct Kernel {
    language_code: String,
}

impl Kernel {
    pub fn bootstrap(language_code: String) -> Result<(), KernelFailure> {
        if KERNEL.get().is_some() {
            return Err(KernelFailure::kernel_bootstrap_failed());
        }

        let kernel = Kernel { language_code };

        KERNEL.set(kernel);
        Ok(())
    }

    pub fn parse_feature_manifest(
        &self,
        json: &JSONStr,
    ) -> Result<FeatureManifest, KernelFailure> {
        FeatureManifest::parse(json, &self.language_code)
    }
}
