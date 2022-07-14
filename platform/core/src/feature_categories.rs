use crate::core_failure::CoreFailure;
use serde::Deserialize;
use std::collections::HashMap;

trait FileSystem {
    fn read_contents_of_file(&self, path: &str) -> Result<Vec<u8>, CoreFailure>;
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct DecodedFeatureCategory {
    id: FeatureCategoryId,
    name: String,
    visible: Option<bool>,
    features: Vec<String>
}

#[derive(PartialEq, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
enum FeatureCategoryId {
    YourData,
    DataKnowHow,
    Tools,
    Developer
}

#[derive(PartialEq, Debug)]
struct Feature {
    pub path: String,
    pub id: String,
    pub name: String,
    pub author: Option<String>,
    pub version: Option<String>,
    pub description: Option<String>,
    pub thumbnail: Option<String>,
    pub thumbnail_color: String,
    pub primary_color: String,
    pub links: HashMap<String, String>,
    pub border_color: String,
    pub tile_text_color: String,
}

#[derive(PartialEq, Debug)]
struct FeatureCategory {
    id: FeatureCategoryId,
    name: String,
    features: Vec<Feature>
}

fn load_feature_categories(fs: impl FileSystem, features_dir: &str) -> Result<Vec<FeatureCategory>, CoreFailure> {
    let categories_json_path = format!("{}/{}", features_dir, "categories.json");
    let categories_bytes = fs.read_contents_of_file(categories_json_path.as_str())?;
    let categories: Vec<DecodedFeatureCategory> = serde_json::from_slice(&categories_bytes)
        .map_err(
            |err| CoreFailure::failed_to_decode_feature_categories_json(err.to_string())
        )?;
    categories
        .into_iter()
        .filter(should_display_feature_category)
        .map(map_feature_category)
        .collect()
}

fn should_display_feature_category(category: &DecodedFeatureCategory) -> bool {
    match category.visible {
        Some(visible) => visible,
        None => false
    }
}

fn map_feature_category(raw_category: DecodedFeatureCategory) -> Result<FeatureCategory, CoreFailure> {
    Ok(FeatureCategory {
        id: raw_category.id,
        name: raw_category.name,
        features: Vec::new()
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use pretty_assertions::assert_eq;
    use std::collections::HashMap;

    struct MockFileSystem {
        contents_of_file_requests_stub: HashMap<String, Result<Vec<u8>, CoreFailure>>,
    }

    impl FileSystem for MockFileSystem {
        fn read_contents_of_file(&self, path: &str) -> Result<Vec<u8>, CoreFailure> {
            self.contents_of_file_requests_stub.get(path).unwrap().clone()
        }
    }

    #[test]
    fn failed_to_load_categories_json_throws_error() {
        let features_dir = "features";
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([
                (features_dir.to_string() + "/categories.json", Err(CoreFailure::null_c_string_pointer()))
            ]),
        };
        let result = load_feature_categories(fs, features_dir);
        assert_eq!(result.is_err(), true)
    }

    #[test]
    fn json_is_malformed_throws_error() {
        let features_dir = "features";
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([
                (features_dir.to_string() + "/categories.json", Ok("invalid".as_bytes().to_vec()))
            ]),
        };
        let result = load_feature_categories(fs, features_dir);
        assert_eq!(result.is_err(), true)
    }

    #[test]
    fn feature_category_ids_parsed_correctly() {
        let features_dir = "features";
        let json = r#"
        [
            {
                "id":"yourData",
                "name":"Your Data",
                "features":[]
            },
            {
                "id":"dataKnowHow",
                "name":"Data Know-How",
                "features":[]
            },
            {
                "id":"tools",
                "name":"Tools",
                "features":[]
            },
            {
                "id":"developer",
                "name":"Developer",
                "features":[]
            }
        ]
        "#.as_bytes().to_vec();
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([
                (features_dir.to_string() + "/categories.json", Ok(json))
            ]),
        };
        let loaded_categories = load_feature_categories(fs, features_dir).unwrap();

        let expexcted_categories = vec![
            FeatureCategory {
                id: FeatureCategoryId::YourData,
                name: "Your Data".to_string(),
                features: Vec::new(),
            },

            FeatureCategory {
                id: FeatureCategoryId::DataKnowHow,
                name: "Data Know-How".to_string(),
                features: Vec::new(),
            },
            FeatureCategory {
                id: FeatureCategoryId::Tools,
                name: "Tools".to_string(),
                features: Vec::new(),
            },
            FeatureCategory {
                id: FeatureCategoryId::Developer,
                name: "Developer".to_string(),
                features: Vec::new(),
            },
        ];
        assert_eq!(loaded_categories, expexcted_categories)
    }

    #[test]
    fn invisible_feature_categories_are_filtered_out() {

        let features_dir = "features";
        let json = r#"
        [
            {
                "id":"yourData",
                "name":"Your Data",
                "visible": true,
                "features":[]
            },
            {
                "id":"dataKnowHow",
                "name":"Data Know-How",
                "visible": false,
                "features":[]
            },
            {
                "id":"tools",
                "name":"Tools",
                "features":[]
            }
        ]
        "#.as_bytes().to_vec();
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([
                (features_dir.to_string() + "/categories.json", Ok(json))
            ]),
        };
        let loaded_categories = load_feature_categories(fs, features_dir).unwrap();
        let loaded_category_ids: Vec<_> = loaded_categories
            .into_iter()
            .map(|category| category.id)
            .collect();

        let expected_ids = vec![
            FeatureCategoryId::YourData,
            FeatureCategoryId::Tools,
        ];
        assert_eq!(loaded_category_ids, expected_ids)


    }
}
