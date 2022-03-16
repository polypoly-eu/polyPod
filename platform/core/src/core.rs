use crate::{
    core_failure::CoreFailure,
    feature_manifest_parsing::{FeatureManifest, JSONStr},
};
use once_cell::sync::OnceCell;

// Core is held as a singleton.
static CORE: OnceCell<Core> = OnceCell::new();

// The Core would act as a composition root, containing any global configuration
// to be shared between components, as well managing components lifetime.
struct Core {
    language_code: String,
}

fn get_instance() -> Result<&'static Core, CoreFailure> {
    match CORE.get() {
        Some(core) => Ok(core),
        None => Err(CoreFailure::core_not_bootstraped()),
    }
}

pub fn bootstrap(language_code: String) -> Result<(), CoreFailure> {
    if CORE.get().is_some() {
        return Err(CoreFailure::core_bootstrap_failed());
    }

    let core = Core { language_code };

    let _ = CORE.set(core);
    Ok(())
}

pub fn parse_feature_manifest(json: &JSONStr) -> Result<FeatureManifest, CoreFailure> {
    let core = get_instance()?;
    FeatureManifest::parse(json, &core.language_code)
}
