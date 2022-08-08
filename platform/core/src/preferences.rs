use crate::io::key_value_store::KeyValueStore;
use serde::de::DeserializeOwned;
use serde::Serialize;
use crate::common::serialization::{message_pack_serialize, message_pack_deserialize};
use crate::user_session::{ TimeoutOptionStore, TimeoutOption };

#[derive(Serialize)]
enum PreferenceKey {
    UserSessionTimeoutOption,
}

pub struct Preferences {
    pub store: Box<dyn KeyValueStore>
}

impl Preferences {
    fn read<Value: DeserializeOwned>(&self, key: PreferenceKey) -> Option<Value> {
        self.store
            .as_ref()
            .read(message_pack_serialize(key))
            .and_then(|bytes|
                match message_pack_deserialize(bytes) {
                    Ok(decoded) => decoded,
                    Err(error) => {
                        println!("Failed to decoded the store preference value, {:?}", error.message);
                        None
                    }
                }
            )
    }

    fn write<Value: Serialize>(&self, key: PreferenceKey, value: Value) {
        self.store
            .as_ref()
            .write(
                message_pack_serialize(key),
                message_pack_serialize(value)
            )
    }
}

impl TimeoutOptionStore for Preferences {
    fn get_timeout_option(&self) -> Option<TimeoutOption> {
        self.read(PreferenceKey::UserSessionTimeoutOption)
    }

    fn set_timeout_option(&self, option: TimeoutOption) {
        self.write(PreferenceKey::UserSessionTimeoutOption, option)
    }
}

