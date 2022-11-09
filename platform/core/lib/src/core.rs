use crate::platform_request::PlatformCallback;
use core_failure::CoreFailure;
use once_cell::sync::OnceCell;
#[cfg(feature = "poly_rdf")]
use poly_rdf::rdf::RDFStore;
use preferences::Preferences;
use std::sync::MutexGuard;
use std::sync::{Arc, Mutex};
use update_notification::UpdateNotification;
use user_session::UserSession;

// Core is held as a singleton.
pub static CORE: OnceCell<Mutex<Core>> = OnceCell::new();

// The Core would act as a composition root, containing any global configuration
// to be shared between components, as well managing components lifetime.
pub struct Core<'a> {
    pub language_code: String,
    #[allow(dead_code)]
    pub preferences: Arc<Preferences>,
    pub user_session: Mutex<UserSession<'a>>,
    pub update_notification: Mutex<UpdateNotification>,
    #[allow(dead_code)]
    pub platform_callback: Box<dyn PlatformCallback>,
    #[cfg(feature = "poly_rdf")]
    pub rdf_store: RDFStore,
}

pub fn get_instance() -> Result<MutexGuard<'static, Core<'static>>, CoreFailure> {
    match CORE.get() {
        Some(core) => core
            .lock()
            .map_err(|_| CoreFailure::core_already_bootstrapped()),
        None => Err(CoreFailure::core_not_bootstrapped()),
    }
}
