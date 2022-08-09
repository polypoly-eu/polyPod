pub trait KeyValueStore: Send + Sync {
    fn read(&self, key: Vec<u8>) -> Option<Vec<u8>>;
    fn write(&self, key: Vec<u8>, value: Vec<u8>);
    fn remove(&self, key: Vec<u8>);
}

extern crate sled;
pub struct DefaultKeyValueStore {
    db: sled::Db,
}

impl DefaultKeyValueStore {
    pub fn new(db_path: String) -> DefaultKeyValueStore {
        DefaultKeyValueStore {
            // Note: As per sled docs, it is adviced to keep the db open
            //       for the duration of the process's lifespan, therefore there is no close option.
            // We are ok with crashing the app here, as it will end in undefined behaviour if db cannot be opened.
            db: sled::open(db_path).unwrap(),
        }
    }
}

impl KeyValueStore for DefaultKeyValueStore {
    fn read(&self, key: Vec<u8>) -> Option<Vec<u8>> {
        self.db.get(key).ok().flatten().map(|ivec| ivec.to_vec())
    }

    fn write(&self, key: Vec<u8>, value: Vec<u8>) {
        self.db.insert(key, value).unwrap();
    }

    fn remove(&self, key: Vec<u8>) {
        _ = self.db.remove(key);
    }
}
