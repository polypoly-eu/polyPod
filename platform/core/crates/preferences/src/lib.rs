use common::serialization::{message_pack_deserialize, message_pack_serialize};
use io::key_value_store::KeyValueStore;
use serde::de::DeserializeOwned;
use serde::Serialize;
use strum::IntoEnumIterator;
use strum_macros::EnumIter;
use update_notification::{LastNotification, UpdateNotificationStore};
use user_session::{TimeoutOption, TimeoutOptionStore};

#[derive(Serialize, EnumIter)]
enum PreferenceKey {
    UserSessionTimeoutOption,
    LastNotification,
}

pub struct Preferences {
    pub store: Box<dyn KeyValueStore>,
}

impl Preferences {
    fn read<Value: DeserializeOwned>(&self, key: PreferenceKey) -> Option<Value> {
        self.store
            .as_ref()
            .read(message_pack_serialize(key))
            .and_then(|bytes| match message_pack_deserialize(bytes) {
                Ok(decoded) => decoded,
                Err(error) => {
                    println!(
                        "Failed to decoded the store preference value, {:?}",
                        error.message
                    );
                    None
                }
            })
    }

    fn write<Value: Serialize>(&self, key: PreferenceKey, value: Value) {
        self.store
            .as_ref()
            .write(message_pack_serialize(key), message_pack_serialize(value))
    }

    pub fn save(&self) {
        self.store.as_ref().save()
    }

    pub fn clear(&self) {
        for key in PreferenceKey::iter() {
            self.store.remove(message_pack_serialize(key));
        }
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

impl UpdateNotificationStore for Preferences {
    fn get_last_notification(&self) -> Option<LastNotification> {
        self.read(PreferenceKey::LastNotification)
    }

    fn set_last_notification(&self, last_notification: LastNotification) {
        self.write(PreferenceKey::LastNotification, last_notification)
    }
}
