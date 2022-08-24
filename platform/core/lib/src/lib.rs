pub mod core {
    use failure::CoreFailure;
    use feature_categories;
    use io::{file_system::DefaultFileSystem, key_value_store::DefaultKeyValueStore};
    use preferences::Preferences;
    use user_session::{TimeoutOption, UserSession, UserSessionTimeout};

    use once_cell::sync::OnceCell;
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
}
