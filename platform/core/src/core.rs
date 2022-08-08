
use crate::{
    core_failure::CoreFailure, 
    feature_categories, 
    io::{ file_system::DefaultFileSystem, key_value_store::DefaultKeyValueStore }, 
    preferences::Preferences,
    user_session::{ UserSession, UserSessionTimeout, TimeoutOption },
};

use once_cell::sync::OnceCell;
use std::{time::Instant, sync::MutexGuard};
use std::sync::{Arc, Mutex};

// Core is held as a singleton.
static CORE: OnceCell<Mutex<Core>> = OnceCell::new();

// The Core would act as a composition root, containing any global configuration
// to be shared between components, as well managing components lifetime.
struct Core<'a> {
    language_code: String,
    #[allow(dead_code)]
    preferences: Arc<Preferences>,
    user_session: Mutex<UserSession<'a>>,
}

fn get_instance() -> Result<MutexGuard<'static, Core<'static>>, CoreFailure> {
    match CORE.get() {
        Some(core) => core.lock().map_err(|_| CoreFailure::core_already_bootstrapped()),
        None => Err(CoreFailure::core_not_bootstrapped()),
    }
}

pub fn bootstrap(language_code: String, fs_root: String) -> Result<(), CoreFailure> {
    if CORE.get().is_some() {
        return Err(CoreFailure::core_already_bootstrapped());
    }
    let preferences = Arc::new(Preferences {
       store: Box::new(DefaultKeyValueStore::new(fs_root + "preferences.store")), 
    });
    let builder = Box::new(Instant::now);

    let user_session = UserSession::new(builder, preferences.clone());
    let core = Core { 
        language_code,
        preferences,
        user_session: Mutex::from(user_session),
    };

    let _ = CORE.set(Mutex::from(core));
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
    let session = instance.user_session.get_mut().unwrap();
    session.did_become_inactive();
    Ok(())
}

// User Session
pub fn is_user_session_expired() -> Result<bool, CoreFailure> {
    let instance = get_instance()?;
    let session = &instance.user_session.lock().unwrap();
    Ok((&session.is_session_expired()).to_owned())
}

pub fn set_user_session_timeout_option(option: TimeoutOption) -> Result<(), CoreFailure> {
    let instance = get_instance()?;
    let session = &instance.user_session.lock().unwrap();
    session.set_timeout_option(option);
    Ok(())
}

pub fn get_user_session_timeout_option() -> Result<TimeoutOption, CoreFailure> {
    let instance = get_instance()?;
    let session = &instance.user_session.lock().unwrap();
    Ok(session.get_timeout_option())
}


pub fn user_session_timeout_config() -> Vec<UserSessionTimeout> {
    TimeoutOption::all_option_timeouts()
}
