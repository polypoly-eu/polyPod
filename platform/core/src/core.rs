use crate::{
    core_failure::CoreFailure,
    feature_manifest_parsing::{FeatureManifest, JSONStr}, rdf::{SPARQLQuery, rdf_query, rdf_update}, rdf_failure::RdfFailure,
    rdf::QueryResults
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
        None => Err(CoreFailure::core_not_bootstrapped()),
    }
}

pub fn bootstrap(language_code: String) -> Result<(), CoreFailure> {
    if CORE.get().is_some() {
        return Err(CoreFailure::core_already_bootstrapped());
    }

    let core = Core { language_code };

    let _ = CORE.set(core);
    Ok(())
}

pub fn parse_feature_manifest(json: &JSONStr) -> Result<FeatureManifest, CoreFailure> {
    let core = get_instance()?;
    FeatureManifest::parse(json, &core.language_code)
}

pub fn exec_rdf_query(query: SPARQLQuery) -> Result<QueryResults, CoreFailure> {
    rdf_query(query).map_err(|err| CoreFailure::map_rdf_to_core_failure(err))
}

pub fn exec_rdf_update(query: SPARQLQuery) -> Result<(), CoreFailure> {
    rdf_update(query).map_err(|err| CoreFailure::map_rdf_to_core_failure(err))
}