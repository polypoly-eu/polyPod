
use crate::{
    core_failure::CoreFailure,
    rdf::{SPARQLQuery, rdf_query, rdf_update, QueryResults},
    feature_categories,
    io::file_system::DefaultFileSystem
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

pub fn load_feature_categories(
    features_dir: &str,
) -> Result<Vec<feature_categories::FeatureCategory>, CoreFailure> {
    let core = get_instance()?;
    feature_categories::load_feature_categories(
        DefaultFileSystem {},
        features_dir,
        &core.language_code,
    )
}

pub fn exec_rdf_query(query: SPARQLQuery, app_path: String) -> Result<QueryResults, CoreFailure> {
    rdf_query(query, app_path).map_err(|err| CoreFailure::map_rdf_to_core_failure(err))
}

pub fn exec_rdf_update(query: SPARQLQuery, app_path: String) -> Result<(), CoreFailure> {
    rdf_update(query, app_path).map_err(|err| CoreFailure::map_rdf_to_core_failure(err))
}