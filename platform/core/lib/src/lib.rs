pub mod core {
    use core_failure::CoreFailure;
    pub use feature_categories;
    use io::{file_system::DefaultFileSystem, key_value_store::DefaultKeyValueStore};
    use preferences::Preferences;
    use user_session::{TimeoutOption, UserSession};

    use common::serialization::message_pack_serialize;
    use once_cell::sync::OnceCell;
    use serde::{Deserialize, Serialize};
    use std::sync::{Arc, Mutex};
    use std::{sync::MutexGuard, time::Instant};

    #[cfg(target_os = "android")]
    use {
        android_logger::Config,
        log::{trace, Level},
    };

    type MessagePackBytes = Vec<u8>;
    const PREFERENCES_DB: &str = "preferences_db";

    // Core is held as a singleton.
    static CORE: OnceCell<Mutex<Core>> = OnceCell::new();

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
        args: BoostrapArgs,
        platform_hook: Box<dyn PlatformHookRequest>,
    ) -> Result<(), CoreFailure> {
        if CORE.get().is_some() {
            return Err(CoreFailure::core_already_bootstrapped());
        }
        let preferences = Arc::new(Preferences {
            store: Box::new(DefaultKeyValueStore::new(
                args.fs_root + "/" + PREFERENCES_DB,
            )),
        });

        let builder = Box::new(Instant::now);
        let user_session = Mutex::from(UserSession::new(builder, preferences.clone()));
        let core = Core {
            language_code: args.language_code,
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

        Ok(())
    }

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

    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    pub struct LoadFeatureCategoriesArguments {
        features_dir: String,
        force_show: Vec<feature_categories::FeatureCategoryId>,
    }

    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    pub struct BoostrapArgs {
        language_code: String,
        fs_root: String,
    }

    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    pub enum CoreRequest {
        LoadFeatureCategories { args: LoadFeatureCategoriesArguments },
        AppDidBecomeInactive,
        IsUserSessionExpired,
        SetUserSessionTimeout{ args: TimeoutOption },
        GetUserSessionTimeoutOption,
        GetUserSessionTimeoutOptionsConfig,
    }

    pub fn exec_request(request: CoreRequest) -> MessagePackBytes {
        let mut instance = match get_instance() {
            Ok(instance) => instance,
            Err(err) => return message_pack_serialize(Err::<(), CoreFailure>(err)),
        };
        match request {
            CoreRequest::LoadFeatureCategories { args } => instance.load_feature_categories(args),
            CoreRequest::AppDidBecomeInactive => instance.app_did_become_inactive(),
            CoreRequest::IsUserSessionExpired => instance.is_user_session_expired(),
            CoreRequest::SetUserSessionTimeout { args } => {
                instance.set_user_session_timeout_option(args)
            }
            CoreRequest::GetUserSessionTimeoutOption => instance.get_user_session_timeout_option(),
            CoreRequest::GetUserSessionTimeoutOptionsConfig => {
                Core::get_user_session_timeout_options_config()
            }
        }
    }

    impl Core<'_> {
        fn load_feature_categories(
            &self,
            args: LoadFeatureCategoriesArguments,
        ) -> MessagePackBytes {
            message_pack_serialize(feature_categories::load_feature_categories(
                DefaultFileSystem {},
                args.features_dir.as_str(),
                &self.language_code,
                args.force_show,
            ))
        }

        fn app_did_become_inactive(&mut self) -> MessagePackBytes {
            message_pack_serialize((|| -> Result<(), CoreFailure> {
                self.user_session
                    .get_mut()
                    .map_err(|err| CoreFailure::failed_to_acess_user_session(err.to_string()))?
                    .did_become_inactive();
                self.preferences.as_ref().save();
                Ok(())
            })())
        }

        fn is_user_session_expired(&self) -> MessagePackBytes {
            message_pack_serialize(
                self.user_session
                    .lock()
                    .map_err(|err| CoreFailure::failed_to_acess_user_session(err.to_string()))
                    .map(|session| session.is_session_expired()),
            )
        }

        fn set_user_session_timeout_option(&self, option: TimeoutOption) -> MessagePackBytes {
            message_pack_serialize(
                self.user_session
                    .lock()
                    .map_err(|err| CoreFailure::failed_to_acess_user_session(err.to_string()))
                    .map(|session| session.set_timeout_option(option)),
            )
        }

        fn get_user_session_timeout_option(&self) -> MessagePackBytes {
            message_pack_serialize(
                self.user_session
                    .lock()
                    .map_err(|err| CoreFailure::failed_to_acess_user_session(err.to_string()))
                    .map(|session| session.get_timeout_option()),
            )
        }

        fn get_user_session_timeout_options_config() -> MessagePackBytes {
            // The current contract between platform and core requires that core responds with a Result type.
            // Embeed in Result type, until further clarifications.
            message_pack_serialize(Ok::<_, CoreFailure>(TimeoutOption::all_option_timeouts()))
        }
    }
}
