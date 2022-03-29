mod c_interface;
mod core;
mod core_failure;
mod feature_manifest_parsing;
// Disable any checks agains the generated code
#[rustfmt::skip]
#[allow(clippy::all)]
#[allow(unused_imports)]
#[allow(dead_code)]
/// cbindgen:ignore
mod flatbuffers_generated;
