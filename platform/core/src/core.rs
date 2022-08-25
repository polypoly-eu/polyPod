use crate::{
    core_failure::CoreFailure,
    feature_categories,
    io::{file_system::DefaultFileSystem, key_value_store::DefaultKeyValueStore},
    preferences::Preferences,
    user_session::{TimeoutOption, UserSession, UserSessionTimeout},
};

use std::path::Path;
use oxigraph::{
    store::Store,
    sparql::QueryResults
};
use once_cell::sync::OnceCell;
use poly_rdf::rdf::{rdf_query, rdf_update, SPARQLQuery};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::{sync::MutexGuard, time::Instant};

#[cfg(target_os = "android")]
use {
    android_logger::Config,
    log::{trace, Level},
};

// Core is held as a singleton.
static CORE: OnceCell<Mutex<Core>> = OnceCell::new();

#[derive(Debug, Clone, Serialize)]
pub enum PlatformRequest {
    Example,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PlatformResponse {
    Example(String),
}

pub trait PlatformHookRequest: Sync + Send {
    fn perform_request(&self, request: PlatformRequest) -> Result<PlatformResponse, CoreFailure>;
}

const PREFERENCES_DB: &str = "preferences_db";

// The Core would act as a composition root, containing any global configuration
// to be shared between components, as well managing components lifetime.
struct Core<'a> {
    language_code: String,
    #[allow(dead_code)]
    preferences: Arc<Preferences>,
    user_session: Mutex<UserSession<'a>>,
    #[allow(dead_code)]
    platform_hook: Box<dyn PlatformHookRequest>,
    fs_root: String,
    active_feature_id: Option<String>,
    feature_rdf_store: Option<Store>,
}

fn get_instance() -> Result<MutexGuard<'static, Core<'static>>, CoreFailure> {
    match CORE.get() {
        Some(core) => core
            .lock()
            .map_err(|_| CoreFailure::core_already_bootstrapped()),
        None => Err(CoreFailure::core_not_bootstrapped()),
    }
}

pub fn bootstrap(
    language_code: String,
    fs_root: String,
    platform_hook: Box<dyn PlatformHookRequest>,
) -> Result<(), CoreFailure> {
    if CORE.get().is_some() {
        return Err(CoreFailure::core_already_bootstrapped());
    }
    let preferences = Arc::new(Preferences {
        store: Box::new(DefaultKeyValueStore::new(fs_root.to_string() + "/" + PREFERENCES_DB)),
    });

    let builder = Box::new(Instant::now);
    let user_session = Mutex::from(UserSession::new(builder, preferences.clone()));
    let core = Core {
        language_code,
        preferences,
        user_session,
        platform_hook,
        fs_root,
        active_feature_id: None,
        feature_rdf_store: None,
    };

    let _ = CORE.set(Mutex::from(core));

    #[cfg(target_os = "android")]
    {
        android_logger::init_once(Config::default().with_min_level(Level::Trace));
        trace!("Rust:core => Bootstrapped!");
    }

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

// Features

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

fn open_store(fs_root: String, active_feature_id: String) -> Result<Store, CoreFailure> {
    Store::open(Path::new(&format!("{}/{}/{}", fs_root, active_feature_id, env!("RDF_DB_PATH")))).map_err(CoreFailure::map_storage_error)
}

pub fn open_feature_rdf_store() -> Result<(), CoreFailure> {
    let mut instance = get_instance()?;
    if instance.active_feature_id == None {
        return Err(CoreFailure::no_active_feature("Open feature rdf store".to_string()))
    }
    match &instance.active_feature_id {
        Some(id) => match open_store(instance.fs_root.to_string(), id.to_string()) {
            Ok(store) => {
                instance.feature_rdf_store = Some(store);
                Ok(())
            },
            Err(error) => Err(error)
        },
        _ => Err(CoreFailure::no_active_feature("Open feature rdf store".to_string()))
    }
}

pub fn exec_feature_rdf_query (
    query: SPARQLQuery,
) -> Result<QueryResults, CoreFailure> {
    let instance = get_instance()?;
    match &instance.feature_rdf_store {
        Some(store) => store.query(&query).map_err(CoreFailure::map_sparql_evaluation_error),
        _ => Err(CoreFailure::feature_store_not_initialized()) 
    }
}


pub fn exec_feature_rdf_update (
    query: SPARQLQuery,
) -> Result<(), CoreFailure> {
    let instance = get_instance()?;
    match &instance.feature_rdf_store {
        Some(store) => store.update(&query).map_err(CoreFailure::map_sparql_evaluation_error),
        _ => Err(CoreFailure::feature_store_not_initialized()) 
    }
}

pub fn exec_rdf_query(query: SPARQLQuery) -> Result<QueryResults, CoreFailure> {
    let instance = get_instance()?;
    rdf_query(query, instance.fs_root.clone()).map_err(CoreFailure::map_rdf_to_core_failure)
}

pub fn exec_rdf_update(query: SPARQLQuery) -> Result<(), CoreFailure> {
    let instance = get_instance()?;
    rdf_update(query, instance.fs_root.clone()).map_err(CoreFailure::map_rdf_to_core_failure)
}

// App events
pub fn app_did_become_inactive() -> Result<(), CoreFailure> {
    let mut instance = get_instance()?;
    let session = instance
        .user_session
        .get_mut()
        .map_err(|err| CoreFailure::failed_to_acess_user_session(err.to_string()))?;
    session.did_become_inactive();
    instance.preferences.as_ref().save();
    Ok(())
}

// User Session
pub fn is_user_session_expired() -> Result<bool, CoreFailure> {
    let instance = get_instance()?;
    let session = &instance
        .user_session
        .lock()
        .map_err(|err| CoreFailure::failed_to_acess_user_session(err.to_string()))?;
    Ok((&session.is_session_expired()).to_owned())
}

pub fn set_user_session_timeout_option(option: TimeoutOption) -> Result<(), CoreFailure> {
    let instance = get_instance()?;
    let session = &instance
        .user_session
        .lock()
        .map_err(|err| CoreFailure::failed_to_acess_user_session(err.to_string()))?;
    session.set_timeout_option(option);
    Ok(())
}

pub fn get_user_session_timeout_option() -> Result<TimeoutOption, CoreFailure> {
    let instance = get_instance()?;
    let session = &instance
        .user_session
        .lock()
        .map_err(|err| CoreFailure::failed_to_acess_user_session(err.to_string()))?;
    Ok(session.get_timeout_option())
}

pub fn get_user_session_timeout_options_config() -> Result<Vec<UserSessionTimeout>, CoreFailure> {
    // The current contract between platform and core requires that core responds with a Result type.
    // Embeed in Result type, until further clarifications.
    Ok(TimeoutOption::all_option_timeouts())
}
