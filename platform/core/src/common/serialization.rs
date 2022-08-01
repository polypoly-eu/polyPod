use rmp_serde::{ Serializer, Deserializer };
use serde::{ Serialize, Deserialize, de::DeserializeOwned };
use std::io::Cursor;

pub fn message_pack_serialize<T: Serialize>(input: T) -> Vec<u8> {
    let mut buf = Vec::new();
    let _result = input.serialize(&mut Serializer::new(&mut buf).with_struct_map());
    buf
}

pub fn message_pack_deserialize<T>(input: Vec<u8>) -> T
where
    T: DeserializeOwned,
{
    let mut de = Deserializer::new(Cursor::new(&input[..]));
    Deserialize::deserialize(&mut de).unwrap()
}
