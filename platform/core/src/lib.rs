#[cfg(target_os = "android")]
extern crate android_logger;
#[cfg(target_os = "android")]
extern crate log;
mod common;
pub mod core;
pub mod core_failure;
pub mod feature_categories;
pub mod feature_file_system;
#[cfg(any(target_os = "ios", target_os = "android"))]
pub mod ffi;
mod io;
mod preferences;
mod user_session;
