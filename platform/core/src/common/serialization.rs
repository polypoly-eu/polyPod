use rmp_serde::{ Serializer, Deserializer };
use serde::{ Serialize, Deserialize, de::DeserializeOwned };
use std::io::Cursor;
use crate::core_failure::CoreFailure;

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
        .map_err(|err| 
            CoreFailure::failed_to_decode_byte_array(err.to_string())
        )?;
    Ok(result)
}
