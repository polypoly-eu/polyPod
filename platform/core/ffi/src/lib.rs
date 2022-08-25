#[cfg(target_os = "ios")]
pub mod c_interface;

#[cfg(target_os = "android")]
#[allow(non_snake_case)]
/// cbindgen:ignore
pub mod java_interface;
