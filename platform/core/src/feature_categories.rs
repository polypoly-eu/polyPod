use crate::core_failure::CoreFailure;
use std::sync::Arc;

trait FileSystem {
    fn read_contents_of_file(&self, path: &str) -> Result<Vec<u8>, std::io::Error>;
}

fn load_feature_categories(fs: impl FileSystem, features_dir: &str) -> Result<(), CoreFailure> {
    fs.read_contents_of_file(features_dir);
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use pretty_assertions::assert_eq;

    struct MockFileSystem {
        contents_of_file_requests_stub: HashMap<String, Result<Vec<u8>, std::io::Error>>,
    }

    impl FileSystem for MockFileSystem {
        fn read_contents_of_file(&mut self, path: &str) -> Result<Vec<u8>, std::io::Error> {
            contents_of_file_requests_stub.get(path).unwrap().clone()
        }
    }

    #[test]
    fn loads_categories_json_from_correct_path() {
        let features_dir = "features";
        let fs = Arc::new(MockFileSystem {
            read_contents_of_file_requests: Vec::new(),
        });
        _ = load_feature_categories(fs.clone());
        let expected_path = features_dir.to_string() + "/categories.json";
        assert_eq!(fs.read_contents_of_file_requests, vec![expected_path])

    }
    #[test]
    fn failed_to_load_categories_json_throws_error() {

    }
}
