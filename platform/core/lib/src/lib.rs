pub mod core {
    use core_failure::CoreFailure;
    use feature::feature::Feature;
    use feature_categories;
    use io::{
        file_system::{ DefaultFileSystem, FileSystem },
        key_value_store::DefaultKeyValueStore,
    };
    use poly_rdf::rdf::{rdf_query, rdf_update, SPARQLQuery};
    use preferences::Preferences;
    use user_session::{TimeoutOption, UserSession, UserSessionTimeout};

    use once_cell::sync::OnceCell;
    use serde::{Deserialize, Serialize};
    use std::path::PathBuf;
    use std::sync::{Arc, Mutex};
    use std::{sync::MutexGuard, time::Instant};

    use oxigraph::sparql::QueryResults;

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

    // The Core would act as a composition root, containing any global configuration
    // to be shared between components, as well managing components lifetime.
    struct Core<'a> {
        language_code: String,
        fs_root: PathBuf,
        file_system: Box<dyn FileSystem>,
        #[allow(dead_code)]
        preferences: Arc<Preferences>,
        user_session: Mutex<UserSession<'a>>,
        #[allow(dead_code)]
        platform_hook: Box<dyn PlatformHookRequest>,
        active_feature: Option<Mutex<Feature>>,
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
            store: Box::new(DefaultKeyValueStore::new(
                fs_root.clone() + "/" + PREFERENCES_DB,
            )),
        });

        let builder = Box::new(Instant::now);
        let user_session = Mutex::from(UserSession::new(builder, preferences.clone()));
        let fs = PathBuf::from(fs_root);
        let core = Core {
            language_code,
            fs_root: fs.clone(),
            file_system: Box::new(DefaultFileSystem {}),
            preferences,
            user_session,
            platform_hook,
            active_feature: None,
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

    pub fn open_feature_rdf_store() -> Result<(), CoreFailure> {
        get_instance()?
            .active_feature
            .as_mut()
            .expect("No active feature is set")
            .get_mut()
            .expect("Cannot access active feature")
            .open_rdf_store()
    }

    pub fn exec_feature_rdf_query(query: SPARQLQuery) -> Result<QueryResults, CoreFailure> {
        get_instance()?
            .active_feature
            .as_ref()
            .expect("No active feature is set")
            .lock()
            .expect("Cannot access active feature")
            .exec_rdf_query(query)
    }

    pub fn exec_feature_rdf_update(query: SPARQLQuery) -> Result<(), CoreFailure> {
        get_instance()?
            .active_feature
            .as_ref()
            .expect("No active feature is set")
            .lock()
            .expect("Cannot access active feature")
            .exec_rdf_update(query)
    }

    pub fn exec_rdf_query(query: SPARQLQuery) -> Result<QueryResults, CoreFailure> {
        let instance = get_instance()?;
        rdf_query(query, instance.fs_root.clone()).map_err(CoreFailure::map_rdf_to_core_failure)
    }

    pub fn exec_rdf_update(query: SPARQLQuery) -> Result<(), CoreFailure> {
        let instance = get_instance()?;
        rdf_update(query, instance.fs_root.clone()).map_err(CoreFailure::map_rdf_to_core_failure)
    }

    // Features

    pub fn load_feature_categories(
        features_dir: &str,
    ) -> Result<Vec<feature_categories::FeatureCategory>, CoreFailure> {
        let core = get_instance()?;
        feature_categories::load_feature_categories(
            core.file_system.as_ref(),
            features_dir,
            &core.language_code,
        )
    }

    // App events

    pub fn did_open_feature(id: String) -> Result<(), CoreFailure> {
        let mut core = get_instance()?;
        let mut feature_path = core.fs_root.clone();
        feature_path.push("FeatureFiles".to_string());
        feature_path.push(id);
        core.file_system
            .as_ref()
            .create_dir_structure(
                // This conversion will go away when FileSystem will be migrated
                // to use Paths instead of raw strings.
                feature_path.clone()
                            .into_os_string()
                            .into_string()
                            .unwrap()
                            .as_str()
            )?;
        core.active_feature = Some(Mutex::from(Feature::new(feature_path)));

        Ok(())
    }

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
