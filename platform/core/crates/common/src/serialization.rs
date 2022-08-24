use failure::CoreFailure;
use rmp_serde::{Deserializer, Serializer};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use std::io::Cursor;

pub fn message_pack_serialize<T: Serialize>(input: T) -> Vec<u8> {
    let mut buf = Vec::new();
    let _result = input.serialize(&mut Serializer::new(&mut buf).with_struct_map());
    buf
}

pub fn message_pack_deserialize<T>(input: Vec<u8>) -> Result<T, CoreFailure>
where
    T: DeserializeOwned,
{
    let mut de = Deserializer::new(Cursor::new(&input[..]));
    let result: T = Deserialize::deserialize(&mut de)
        .map_err(|err| CoreFailure::failed_to_decode_byte_array(err.to_string()))?;
    Ok(result)
}
