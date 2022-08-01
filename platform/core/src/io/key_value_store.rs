pub trait KeyValueStorage: Send + Sync {
    fn read(&self, key: Vec<u8>) -> Option<Vec<u8>>;
    fn write(&self, key: Vec<u8>, value: Vec<u8>);
    fn remove(&self, key: Vec<u8>);
}

pub struct DefaultKeyValueStore {
    pub db_path: String
}

extern crate sled;

impl DefaultKeyValueStore {
    fn open_db(&self) -> sled::Db {
        sled::open(self.db_path.clone()).unwrap()
    }
}

impl KeyValueStorage for DefaultKeyValueStore {
    fn read(&self, key: Vec<u8>) -> Option<Vec<u8>> {
        let db = self.open_db();
        let res = db.get(key);
        let unwr = res.unwrap().map(|x| x.to_vec());
        unwr
    }

    fn write(&self, key: Vec<u8>, value: Vec<u8>) {
        self.open_db().insert(key, value).unwrap();
    }

    fn remove(&self, key: Vec<u8>) {
        self.open_db().remove(key).unwrap();
    }
}
