use crate::{
    core::{Core, CORE},
    platform_request::PlatformCallback,
};
use core_failure::CoreFailure;
use io::key_value_store::DefaultKeyValueStore;
#[cfg(feature = "poly_rdf")]
use poly_rdf::rdf::RDFStore;
use preferences::Preferences;
use serde::Deserialize;
#[allow(unused_imports)]
use std::path::PathBuf;
use std::{
    sync::{Arc, Mutex},
    time::Instant,
};
use update_notification::UpdateNotification;
use user_session::UserSession;

#[cfg(target_os = "android")]
use {
    android_logger::Config,
    log::{trace, Level},
};

const PREFERENCES_DB: &str = "preferences_db";
#[cfg(feature = "poly_rdf")]
const RDF_DB: &str = "rdf_db";

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BoostrapArgs {
    language_code: String,
    fs_root: String,
    update_notification_id: u32,
}

pub fn bootstrap(
    args: BoostrapArgs,
    platform_callback: Box<dyn PlatformCallback>,
) -> Result<(), CoreFailure> {
    if CORE.get().is_some() {
        return Err(CoreFailure::core_already_bootstrapped());
    }
    #[allow(clippy::redundant_clone)] // allowed until RDF is fully enabled
    let preferences = Arc::new(Preferences {
        store: Box::new(DefaultKeyValueStore::new(
            args.fs_root.clone() + "/" + PREFERENCES_DB,
        )),
    });

    let builder = Box::new(Instant::now);
    let user_session = Mutex::from(UserSession::new(builder, preferences.clone()));

    let update_notification = Mutex::from(UpdateNotification::new(
        args.update_notification_id,
        preferences.clone(),
    ));

    let core = Core {
        language_code: args.language_code,
        preferences,
        user_session,
        update_notification,
        platform_callback,
        #[cfg(feature = "poly_rdf")]
        rdf_store: RDFStore::new(PathBuf::from(args.fs_root.clone() + "/" + RDF_DB))
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
