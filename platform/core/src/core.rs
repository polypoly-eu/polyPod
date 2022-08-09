use crate::{core_failure::CoreFailure, feature_categories, io::file_system::DefaultFileSystem};
use once_cell::sync::OnceCell;
use serde::{Deserialize, Serialize};

#[cfg(target_os = "android")]
use {
    crate::rdf::{rdf_query, rdf_update, SPARQLQuery},
    android_logger::Config,
    log::{trace, Level},
};

// Core is held as a singleton.
static CORE: OnceCell<Core> = OnceCell::new();

#[derive(Debug, Clone, Serialize)]
pub enum PlatformRequest {
    Example,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PlatformResponse {
    Example(String),
}

pub trait PlatformHookRequest: Sync + Send {
    fn perform_request(&self, request: PlatformRequest) -> Result<PlatformResponse, String>;
}

// The Core would act as a composition root, containing any global configuration
// to be shared between components, as well managing components lifetime.
struct Core {
    language_code: String,
    #[allow(dead_code)]
    platform_hook: Box<dyn PlatformHookRequest>,
}

fn get_instance() -> Result<&'static Core, CoreFailure> {
    match CORE.get() {
        Some(core) => Ok(core),
        None => Err(CoreFailure::core_not_bootstrapped()),
    }
}

pub fn bootstrap(
    language_code: String,
    platform_hook: Box<dyn PlatformHookRequest>,
) -> Result<(), CoreFailure> {
    if CORE.get().is_some() {
        return Err(CoreFailure::core_already_bootstrapped());
    }

    #[cfg(target_os = "android")]
    {
        android_logger::init_once(Config::default().with_min_level(Level::Trace));
        trace!("Rust:core => Bootstrapped!");
    }

    let core = Core {
        language_code,
        platform_hook,
    };

    let _ = CORE.set(core);
    // For testing purposes
    // let core_2 = get_instance().unwrap();
    // let response = core_2
    //     .platform_hook
    //     .perform_request(PlatformRequest::Example)
    //     .unwrap();
    // match response {
    //     PlatformResponse::Example(a) => assert_eq!("Test".to_string(), a),
    // }
    // #[cfg(target_os = "android")]
    // trace!("Rust:core => Platform response is fine!");
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

#[cfg(target_os = "android")]
pub fn exec_rdf_query(query: SPARQLQuery, app_path: String) -> Result<String, CoreFailure> {
    rdf_query(query, app_path).map_err(CoreFailure::map_rdf_to_core_failure)
}

#[cfg(target_os = "android")]
pub fn exec_rdf_update(query: SPARQLQuery, app_path: String) -> Result<(), CoreFailure> {
    rdf_update(query, app_path).map_err(CoreFailure::map_rdf_to_core_failure)
}
