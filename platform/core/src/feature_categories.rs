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

#[derive(Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct DecodedFeatureManifest {
    name: Option<String>,
    author: Option<String>,
    version: Option<String>,
    description: Option<String>,
    thumbnail: Option<String>,
    thumbnail_color: Option<String>,
    primary_color: Option<String>,
    links: Option<HashMap<String, String>>,
    translations: Option<HashMap<String, DecodedFeatureManifestTranslation>>,
    border_color: Option<String>,
    tile_text_color: Option<String>
}

impl Default for DecodedFeatureManifest {
    fn default() -> Self {
        DecodedFeatureManifest {
            name: Some("name".to_string()),
            author: Some("author".to_string()),
            version: Some("version".to_string()),
            description: Some("description".to_string()),
            thumbnail: Some("thumbnail".to_string()),
            thumbnail_color: Some("thumbnail_color".to_string()),
            primary_color: Some("primary_color".to_string()),
            links: Some(
                HashMap::from([
                      ("some_link".to_string(), "https://some_link.com".to_string()),
                ])
            ),
            translations: None,
            border_color: Some("border_color".to_string()),
            tile_text_color: Some("tile_text_color".to_string()),
        }
    }
}

#[derive(Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct DecodedFeatureManifestTranslation {
    name: Option<String>,
    description: Option<String>,
    links: Option<HashMap<String, String>>,
}

#[derive(PartialEq, Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
enum FeatureCategoryId {
    YourData,
    DataKnowHow,
    Tools,
    Developer
}

#[derive(PartialEq, Debug, Clone)]
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

#[derive(PartialEq, Debug, Clone)]
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
        .map( |raw_category|
            map_feature_category(&fs, features_dir, raw_category)
        )
        .collect()
}

fn should_display_feature_category(category: &DecodedFeatureCategory) -> bool {
    match category.visible {
        Some(visible) => visible,
        None => true,
    }
}

fn map_feature_category(
    fs: &impl FileSystem, 
    features_dir: &str,
    raw_category: DecodedFeatureCategory
) -> Result<FeatureCategory, CoreFailure> {
    let features: Vec<_> = raw_category
        .features
        .into_iter()
        .map(|feature_id|
             load_feature_manifest(fs, features_dir, &feature_id)
        )
        .collect::<Result<Vec<DecodedFeatureManifest>, CoreFailure>>()?;
    Ok(FeatureCategory {
        id: raw_category.id,
        name: raw_category.name,
        features: Vec::new()
    })
}

fn load_feature_manifest(fs: &impl FileSystem, features_dir: &str, id: &str) -> Result<DecodedFeatureManifest, CoreFailure> {
    let manifest_json_path = format!("{}/{}/{}", features_dir, id, "manifest.json");
    let manifest_bytes = fs.read_contents_of_file(manifest_json_path .as_str())?;

    serde_json::from_slice(&manifest_bytes)
        .map_err(
            |err| CoreFailure::failed_to_parse_feature_manifest(err.to_string())
        )
}

fn map_feature(features_dir: &str, id: &str, feature_manifest: DecodedFeatureManifest) -> Result<Feature, CoreFailure> {
    Ok(Feature {
        path: format!("{}/{}", features_dir, id),
        id: id.to_string(),
        name: feature_manifest.name.unwrap(),
        author: feature_manifest.author,
        version: feature_manifest.version,
        description: feature_manifest.description,
        thumbnail: feature_manifest.thumbnail,
        thumbnail_color: feature_manifest.thumbnail_color.unwrap(),
        primary_color: feature_manifest.primary_color.unwrap(),
        links: feature_manifest.links.unwrap(),
        border_color: feature_manifest.border_color.unwrap(),
        tile_text_color: feature_manifest.tile_text_color.unwrap(),
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

    #[test]
    fn failed_to_load_feature_manifest_throws_error() {
        let features_dir = "features";
        let json = r#"
        [
            {
                "id":"yourData",
                "name":"Your Data",
                "features":["facebookImporter"]
            }
        ]
        "#.as_bytes().to_vec();
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([
                (features_dir.to_string() + "/categories.json", Ok(json)),
                (features_dir.to_string() + "/facebookImporter/manifest.json", Err(any_error()))
            ]),
        };
        let loaded_categories = load_feature_categories(fs, features_dir);
        assert_eq!(loaded_categories.is_err(), true)
    }

    #[test]
    fn invalid_manifest_json_throws_error() {
        let features_dir = "features";
        let json = r#"
        [
            {
                "id":"yourData",
                "name":"Your Data",
                "features":["facebookImporter"]
            }
        ]
        "#.as_bytes().to_vec();
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([
                (features_dir.to_string() + "/categories.json", Ok(json)),
                (features_dir.to_string() + "/facebookImporter/manifest.json", Ok("invalid".as_bytes().to_vec()))
            ]),
        };
        let loaded_categories = load_feature_categories(fs, features_dir);
        assert_eq!(loaded_categories.is_err(), true)
    }

    #[test]
    fn features_are_associated_correctly() {
        let features_dir = "features";
        let json = r#"
        [
            {
                "id":"yourData",
                "name":"Your Data",
                "features":["facebookImporter", "lexicon"]
            },
            {
                "id":"tools",
                "name":"Tools",
                "features":["googleImporter", "demo"]
            }
        ]
        "#.as_bytes().to_vec();
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([
                (features_dir.to_string() + "/categories.json", Ok(json)),
                (
                    features_dir.to_string() + "/facebookImporter/manifest.json",
                    Ok("invalid".as_bytes().to_vec())
                ),
                (
                    features_dir.to_string() + "/lexicon/manifest.json",
                    Ok("invalid".as_bytes().to_vec())
                ),
                (
                    features_dir.to_string() + "/googleImporter/manifest.json",
                    Ok("invalid".as_bytes().to_vec())
                ),
                (
                    features_dir.to_string() + "/demo/manifest.json",
                    Ok("invalid".as_bytes().to_vec())
                ),
            ]),
        };
        let loaded_categories = load_feature_categories(fs, features_dir).unwrap();
        let your_data_category_features: Vec<_> = loaded_categories[0].clone().features.into_iter().map(|feature| feature.id).collect(); 
        let tools_category_features: Vec<_> = loaded_categories[1].clone().features.into_iter().map(|feature| feature.id).collect(); 
        assert_eq!(your_data_category_features, vec!["facebookImporter", "lexicon"]);
        assert_eq!(tools_category_features, vec!["googleImporter", "demo"]);
    }

    #[test]
    fn map_feature_without_translations() {
        let feature_manifest = DecodedFeatureManifest::default();
        let features_dir = "features";
        let feature_id = "feature_x";
        let feature = map_feature(features_dir, feature_id, feature_manifest.clone()).unwrap();
        assert_eq!(feature.path, format!("{}/{}", features_dir, feature_id));
        assert_eq!(feature.id, feature_id.to_string());
        assert_eq!(feature.name, feature_manifest.name.unwrap());
        assert_eq!(feature.author, feature_manifest.author);
        assert_eq!(feature.version, feature_manifest.version);
        assert_eq!(feature.description, feature_manifest.description);
        assert_eq!(feature.thumbnail, feature_manifest.thumbnail);
        assert_eq!(feature.thumbnail_color, feature_manifest.thumbnail_color.unwrap());
        assert_eq!(feature.primary_color, feature_manifest.primary_color.unwrap());
        assert_eq!(feature.links, feature_manifest.links.unwrap());
        assert_eq!(feature.border_color, feature_manifest.border_color.unwrap());
        assert_eq!(feature.tile_text_color, feature_manifest.tile_text_color.unwrap());
    }

    fn any_error() -> CoreFailure {
        CoreFailure::failed_to_parse_feature_manifest("any".to_string())
    }

}
