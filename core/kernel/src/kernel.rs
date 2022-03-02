use crate::{
    feature_manifest_parsing::{FeatureManifest, JSONStr},
    kernel_failure::KernelFailure,
};
use once_cell::sync::OnceCell;

// Kernel is held as a singleton.
static KERNEL: OnceCell<Kernel> = OnceCell::new();

// The Kernel would act as a composition root, containing any global configuration
// to be shared between components, as well managing components life time.
struct Kernel {
    language_code: String,
}

fn get_instance() -> Result<&'static Kernel, KernelFailure> {
    match KERNEL.get() {
        Some(kernel) => Ok(kernel),
        None => Err(KernelFailure::kernel_not_bootstraped()),
    }
}

pub fn bootstrap(language_code: String) -> Result<(), KernelFailure> {
    if KERNEL.get().is_some() {
        return Err(KernelFailure::kernel_bootstrap_failed());
    }

    let kernel = Kernel { language_code };

    let _ = KERNEL.set(kernel);
    Ok(())
}

pub fn parse_feature_manifest(json: &JSONStr) -> Result<FeatureManifest, KernelFailure> {
    let kernel = get_instance()?;
    FeatureManifest::parse(json, &kernel.language_code)
}
