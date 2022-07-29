#[cfg(target_os = "ios")]
pub mod c_interface;
#[cfg(target_os = "android")]
#[allow(non_snake_case)]
/// cbindgen:ignore
pub mod java_interface;

use rmp_serde::Serializer;
use serde::Serialize;

fn serialize<T: Serialize>(input: T) -> Vec<u8> {
    let mut buf = Vec::new();
    let _result = input.serialize(&mut Serializer::new(&mut buf).with_struct_map());
    buf
}
