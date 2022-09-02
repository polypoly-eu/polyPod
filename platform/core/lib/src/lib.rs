pub mod core {
    use core_failure::CoreFailure;
    pub use feature_categories;
    use io::{file_system::DefaultFileSystem, key_value_store::DefaultKeyValueStore};
    use preferences::Preferences;

    #[cfg(feature = "poly_rdf")]
    use poly_rdf::rdf::{RDFStore, SPARQLQuery, SPARQLUpdate};
    #[cfg(feature = "poly_rdf")]
    pub use poly_rdf::{
        rdf::{QueryResults, QueryResultsFormat},
        rdf_failure::RdfFailure,
    };

    use user_session::{TimeoutOption, UserSession, UserSessionTimeout};

    use once_cell::sync::OnceCell;
    use serde::{Deserialize, Serialize};
    #[allow(unused_imports)]
    use std::path::PathBuf;
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
        fn perform_request(
            &self,
            request: PlatformRequest,
        ) -> Result<PlatformResponse, CoreFailure>;
    }

    const PREFERENCES_DB: &str = "preferences_db";
    #[cfg(feature = "poly_rdf")]
    const RDF_DB: &str = "rdf_db";

    // The Core would act as a composition root, containing any global configuration
    // to be shared between components, as well managing components lifetime.
    struct Core<'a> {
        language_code: String,
        #[allow(dead_code)]
        preferences: Arc<Preferences>,
        user_session: Mutex<UserSession<'a>>,
        #[allow(dead_code)]
        platform_hook: Box<dyn PlatformHookRequest>,
        #[cfg(feature = "poly_rdf")]
        rdf_store: RDFStore,
    }

    #[derive(Deserialize)]
    pub struct LoadFeatureCategoriesArguments {
        features_dir: String,
        force_show: Vec<feature_categories::FeatureCategoryId>,
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
            store: Box::new(DefaultKeyValueStore::new(fs_root + "/" + PREFERENCES_DB)),
        });

        let builder = Box::new(Instant::now);
        let user_session = Mutex::from(UserSession::new(builder, preferences.clone()));

        let core = Core {
            language_code,
            preferences,
            user_session,
            platform_hook,
            #[cfg(feature = "poly_rdf")]
            rdf_store: RDFStore::new(PathBuf::from(fs_root.clone() + "/" + RDF_DB))
                .map_err(|failure| failure.to_core_failure())?,
        };

        let _ = CORE.set(Mutex::from(core));

        #[cfg(target_os = "android")]
        {
            android_logger::init_once(Config::default().with_min_level(Level::Trace));
            trace!("Rust:core => Bootstrapped!");
        }

        Ok(())
    }

    // RDF

    #[cfg(feature = "poly_rdf")]
    pub fn exec_rdf_query(query: SPARQLQuery) -> Result<QueryResults, CoreFailure> {
        get_instance()?
            .rdf_store
            .query(query)
            .map_err(|failure| failure.to_core_failure())
    }

    #[cfg(feature = "poly_rdf")]
    pub fn exec_rdf_update(update: SPARQLUpdate) -> Result<(), CoreFailure> {
        get_instance()?
            .rdf_store
            .update(update)
            .map_err(|failure| failure.to_core_failure())
    }

    // Features

    pub fn load_feature_categories(
        args: LoadFeatureCategoriesArguments,
    ) -> Result<Vec<feature_categories::FeatureCategory>, CoreFailure> {
        let core = get_instance()?;
        feature_categories::load_feature_categories(
            DefaultFileSystem {},
            args.features_dir.as_str(),
            &core.language_code,
            args.force_show,
        )
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

    pub fn get_user_session_timeout_options_config() -> Result<Vec<UserSessionTimeout>, CoreFailure>
    {
        // The current contract between platform and core requires that core responds with a Result type.
        // Embeed in Result type, until further clarifications.
        Ok(TimeoutOption::all_option_timeouts())
    }
}
