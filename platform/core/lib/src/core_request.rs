use crate::core::{get_instance, Core};
use common::serialization::message_pack_serialize;
use core_failure::CoreFailure;
pub use feature_categories;
use io::file_system::DefaultFileSystem;
#[cfg(feature = "poly_rdf")]
use poly_rdf::rdf::{SPARQLQuery, SPARQLUpdate};
#[cfg(feature = "poly_rdf")]
pub use poly_rdf::{
    rdf::{QueryResults, QueryResultsFormat},
    rdf_failure::RdfFailure,
};
use serde::Deserialize;
#[allow(unused_imports)]
use std::path::PathBuf;
use user_session::TimeoutOption;
#[cfg(target_os = "android")]
use {
    android_logger::Config,
    log::{trace, Level},
};

type MessagePackBytes = Vec<u8>;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoadFeatureCategoriesArguments {
    features_dir: String,
    force_show: Vec<feature_categories::FeatureCategoryId>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetPreferenceArguments {
    key: String,
    value: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum CoreRequest {
    LoadFeatureCategories {
        args: LoadFeatureCategoriesArguments,
    },
    HandleAppDidBecomeInactive,
    IsUserSessionExpired,
    SetUserSessionTimeout {
        args: TimeoutOption,
    },
    GetUserSessionTimeoutOption,
    GetUserSessionTimeoutOptionsConfig,
    #[cfg(feature = "poly_rdf")]
    ExecuteRdfQuery {
        args: String,
    },
    #[cfg(feature = "poly_rdf")]
    ExecuteRdfUpdate {
        args: String,
    },
    HandleStartup,
    HandleFirstRun,
    HandleInAppNotificationSeen,
    HandlePushNotificationSeen,
    ShouldShowInAppNotification,
    ShouldShowPushNotification,
    ClearPreferences,
    SetPreference {
        args: SetPreferenceArguments,
    },
}

pub fn execute_request(request: CoreRequest) -> MessagePackBytes {
    let mut instance = match get_instance() {
        Ok(instance) => instance,
        Err(err) => return message_pack_serialize(Err::<(), CoreFailure>(err)),
    };
    match request {
        CoreRequest::LoadFeatureCategories { args } => instance.load_feature_categories(args),
        CoreRequest::HandleAppDidBecomeInactive => instance.handle_app_did_become_inactive(),
        CoreRequest::IsUserSessionExpired => instance.is_user_session_expired(),
        CoreRequest::SetUserSessionTimeout { args } => {
            instance.set_user_session_timeout_option(args)
        }
        CoreRequest::GetUserSessionTimeoutOption => instance.get_user_session_timeout_option(),
        CoreRequest::GetUserSessionTimeoutOptionsConfig => {
            Core::get_user_session_timeout_options_config()
        }
        #[cfg(feature = "poly_rdf")]
        CoreRequest::ExecuteRdfQuery { args } => instance.exec_rdf_query(args),
        #[cfg(feature = "poly_rdf")]
        CoreRequest::ExecuteRdfUpdate { args } => instance.exec_rdf_update(args),
        CoreRequest::HandleStartup => instance.handle_startup(),
        CoreRequest::HandleFirstRun => instance.handle_first_run(),
        CoreRequest::HandleInAppNotificationSeen => instance.handle_in_app_notification_seen(),
        CoreRequest::HandlePushNotificationSeen => instance.handle_push_notification_seen(),
        CoreRequest::ShouldShowInAppNotification => instance.should_show_in_app_notification(),
        CoreRequest::ShouldShowPushNotification => instance.should_show_push_notification(),
        CoreRequest::ClearPreferences => instance.clear_preferences(),
        CoreRequest::SetPreference { args } => instance.set_preference(args),
    }
}

impl Core<'_> {
    fn load_feature_categories(&self, args: LoadFeatureCategoriesArguments) -> MessagePackBytes {
        message_pack_serialize(feature_categories::load_feature_categories(
            DefaultFileSystem {},
            args.features_dir.as_str(),
            &self.language_code,
            args.force_show,
        ))
    }

    fn handle_app_did_become_inactive(&mut self) -> MessagePackBytes {
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

    #[cfg(feature = "poly_rdf")]
    pub fn exec_rdf_query(&self, query: SPARQLQuery) -> MessagePackBytes {
        message_pack_serialize(
            self.rdf_store
                .query(query)
                .and_then(to_json_bytes)
                .and_then(bytes_to_string)
                .map_err(|failure| failure.to_core_failure()),
        )
    }

    #[cfg(feature = "poly_rdf")]
    pub fn exec_rdf_update(&self, update: SPARQLUpdate) -> MessagePackBytes {
        message_pack_serialize(
            self.rdf_store
                .update(update)
                .map_err(|failure| failure.to_core_failure()),
        )
    }

    pub fn handle_startup(&self) -> MessagePackBytes {
        self.update_notification.lock().unwrap().handle_startup();
        message_pack_serialize(Ok(()) as Result<(), CoreFailure>)
    }

    pub fn handle_first_run(&self) -> MessagePackBytes {
        self.update_notification.lock().unwrap().handle_first_run();
        message_pack_serialize(Ok(()) as Result<(), CoreFailure>)
    }

    pub fn handle_in_app_notification_seen(&self) -> MessagePackBytes {
        self.update_notification
            .lock()
            .unwrap()
            .handle_in_app_seen();
        message_pack_serialize(Ok(()) as Result<(), CoreFailure>)
    }

    pub fn handle_push_notification_seen(&self) -> MessagePackBytes {
        self.update_notification.lock().unwrap().handle_push_seen();
        message_pack_serialize(Ok(()) as Result<(), CoreFailure>)
    }

    pub fn should_show_in_app_notification(&self) -> MessagePackBytes {
        let show = self
            .update_notification
            .lock()
            .unwrap()
            .should_show_in_app();
        message_pack_serialize(Ok(show) as Result<bool, CoreFailure>)
    }

    pub fn should_show_push_notification(&self) -> MessagePackBytes {
        let show = self.update_notification.lock().unwrap().should_show_push();
        message_pack_serialize(Ok(show) as Result<bool, CoreFailure>)
    }

    pub fn clear_preferences(&self) -> MessagePackBytes {
        self.preferences.clear();
        message_pack_serialize(Ok(()) as Result<(), CoreFailure>)
    }

    pub fn set_preference(&self, args: SetPreferenceArguments) -> MessagePackBytes {
        match args.key.as_str() {
            "lastUpdateNotificationId" => self
                .update_notification
                .lock()
                .unwrap()
                .migrate_last_id(args.value),
            "lastUpdateNotificationState" => self
                .update_notification
                .lock()
                .unwrap()
                .migrate_last_state(args.value),
            &_ => {
                return message_pack_serialize(
                    Err(CoreFailure::failed_to_set_preference(args.key)) as Result<(), CoreFailure>,
                );
            }
        }
        message_pack_serialize(Ok(()) as Result<(), CoreFailure>)
    }
}

#[cfg(feature = "poly_rdf")]
fn to_json_bytes(query_results: QueryResults) -> Result<Vec<u8>, RdfFailure> {
    let mut results = Vec::new();
    match query_results.write(&mut results, QueryResultsFormat::Json) {
        Ok(_) => Ok(results),
        Err(error) => Err(RdfFailure::map_evaluation_error(error)),
    }
}

#[cfg(feature = "poly_rdf")]
fn bytes_to_string(utf8_byte_array: Vec<u8>) -> Result<String, RdfFailure> {
    match std::str::from_utf8(&utf8_byte_array) {
        Ok(result) => Ok(result.to_string()),
        Err(error) => Err(RdfFailure::map_utf8_error(error)),
    }
}
