use std::borrow::{Borrow, BorrowMut};

use crate::{core_failure::CoreFailure, feature_categories, io::file_system::DefaultFileSystem};
use once_cell::sync::OnceCell;
use serde::{Deserialize, Serialize};

// Core is held as a singleton.
static CORE: OnceCell<Core> = OnceCell::new();

#[derive(Debug, Clone, Serialize)]
pub enum NativeRequest {
    ExecuteSmth(String),
}

#[derive(Debug, Clone, Deserialize)]
pub enum NativeResponse {
    Response(String),
}

pub trait PlatformHookRequest: Sync + Send {
    fn perform_request(&self, request: NativeRequest) -> NativeResponse;
}

// The Core would act as a composition root, containing any global configuration
// to be shared between components, as well managing components lifetime.
struct Core {
    language_code: String,
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

    let core = Core {
        language_code,
        platform_hook,
    };

    let _ = CORE.set(core);
    let core_2 = get_instance().unwrap();
    let response = core_2
        .platform_hook
        .perform_request(NativeRequest::ExecuteSmth("Hello".to_string()));
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
