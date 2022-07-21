use crate::core_failure::CoreFailure;
use crate::io::file_system::FileSystem;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(PartialEq, Debug, Clone, Serialize)]
pub struct FeatureCategory {
    pub id: FeatureCategoryId,
    pub name: String,
    pub features: Vec<Feature>,
}

#[derive(PartialEq, Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum FeatureCategoryId {
    YourData,
    KnowHow,
    Tools,
    Developer,
}

#[derive(PartialEq, Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Feature {
    pub path: String,
    pub id: String,
    pub name: String,
    pub author: Option<String>,
    pub version: Option<String>,
    pub description: Option<String>,
    pub thumbnail_color: String,
    pub thumbnail: Option<String>,
    pub primary_color: String,
    pub border_color: String,
    pub tile_text_color: String,
    pub links: HashMap<String, String>,
}

pub fn load_feature_categories(
    fs: impl FileSystem,
    features_dir: &str,
    language_code: &str,
) -> Result<Vec<FeatureCategory>, CoreFailure> {
    load_raw_categories(&fs, features_dir)?
        .into_iter()
        .filter(should_display_feature_category)
        .map(|raw_category| map_feature_category(&fs, features_dir, language_code, raw_category))
        .collect()
}

fn categories_json_path_format(features_dir: &str) -> String {
    format!("{}/{}", features_dir, "categories.json")
}

fn feature_manifest_json_path_format(features_dir: &str, feature_id: &str) -> String {
    format!("{}/{}/{}", features_dir, feature_id, "manifest.json")
}

fn feature_thumnail_path_format(features_dir: &str, feature_id: &str, thumbnail: &str) -> String {
    format!("{}/{}/{}", features_dir, feature_id, thumbnail)
}

fn feature_path_format(features_dir: &str, feature_id: &str) -> String {
    format!("{}/{}", features_dir, feature_id)
}

const DEFAULT_PRIMARY_COLOR: &str = "#ffffff";
const DEFAULT_TILE_TEXT_COLOR: &str = "#000000";

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct DecodedFeatureCategory {
    id: FeatureCategoryId,
    name: String,
    visible: Option<bool>,
    features: Vec<String>,
}

#[derive(Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct DecodedFeatureManifest {
    name: Option<String>,
    author: Option<String>,
    version: Option<String>,
    description: Option<String>,
    thumbnail: Option<String>,
    primary_color: Option<String>,
    thumbnail_color: Option<String>,
    border_color: Option<String>,
    tile_text_color: Option<String>,
    links: Option<HashMap<String, String>>,
    translations: Option<HashMap<String, DecodedFeatureManifest>>,
}

fn load_raw_categories(
    fs: &impl FileSystem,
    features_dir: &str,
) -> Result<Vec<DecodedFeatureCategory>, CoreFailure> {
    let categories_json_path = categories_json_path_format(features_dir);
    let categories_bytes = fs.read_contents_of_file(categories_json_path.as_str())?;
    serde_json::from_slice(&categories_bytes)
        .map_err(|err| CoreFailure::failed_to_decode_feature_categories_json(err.to_string()))
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
    language_code: &str,
    raw_category: DecodedFeatureCategory,
) -> Result<FeatureCategory, CoreFailure> {
    let features: Vec<_> = raw_category
        .features
        .into_iter()
        .map(|feature_id| load_feature(fs, features_dir, language_code, &feature_id))
        .collect::<Result<Vec<Feature>, CoreFailure>>()?;
    Ok(FeatureCategory {
        id: raw_category.id,
        name: raw_category.name,
        features: features,
    })
}

fn load_feature(
    fs: &impl FileSystem,
    features_dir: &str,
    language_code: &str,
    feature_id: &str,
) -> Result<Feature, CoreFailure> {
    load_feature_manifest(fs, features_dir, feature_id)
        .and_then(|manifest| map_feature(features_dir, &feature_id, language_code, manifest))
}

fn load_feature_manifest(
    fs: &impl FileSystem,
    features_dir: &str,
    id: &str,
) -> Result<DecodedFeatureManifest, CoreFailure> {
    let manifest_json_path = feature_manifest_json_path_format(features_dir, id);
    let manifest_bytes = fs.read_contents_of_file(manifest_json_path.as_str())?;

    serde_json::from_slice(&manifest_bytes)
        .map_err(|err| CoreFailure::failed_to_parse_feature_manifest(err.to_string()))
}

fn map_feature(
    features_dir: &str,
    id: &str,
    language_code: &str,
    feature_manifest: DecodedFeatureManifest,
) -> Result<Feature, CoreFailure> {
    let translation = feature_manifest
        .translations
        .as_ref()
        .and_then(|unwrapped| unwrapped.get(language_code));

    let mut links = feature_manifest.links.unwrap_or_default();
    if let Some(translated_links) = translation.and_then(|manifest| manifest.links.clone()) {
        links.extend(translated_links.into_iter());
    }
    let primary_color = translation
        .and_then(|tr| tr.primary_color.clone())
        .or(feature_manifest.primary_color)
        .unwrap_or(DEFAULT_PRIMARY_COLOR.to_string());
    let thumbnail_color = translation
        .and_then(|tr| tr.thumbnail_color.clone())
        .or(feature_manifest.thumbnail_color)
        .unwrap_or(primary_color.clone());
    let thumbnail = translation
        .and_then(|tr| tr.thumbnail.clone())
        .or(feature_manifest.thumbnail)
        .map(|thumbnail| feature_thumnail_path_format(features_dir, id, &thumbnail));
    Ok(Feature {
        path: feature_path_format(features_dir, id),
        id: id.to_string(),
        name: translation
            .and_then(|tr| tr.name.clone())
            .or(feature_manifest.name)
            .unwrap_or(id.to_string()),
        author: translation
            .and_then(|tr| tr.author.clone())
            .or(feature_manifest.author),
        version: translation
            .and_then(|tr| tr.version.clone())
            .or(feature_manifest.version),
        description: translation
            .and_then(|tr| tr.description.clone())
            .or(feature_manifest.description),
        thumbnail: thumbnail,
        primary_color: primary_color,
        thumbnail_color: thumbnail_color.clone(),
        border_color: translation
            .and_then(|tr| tr.border_color.clone())
            .or(feature_manifest.border_color)
            .unwrap_or(thumbnail_color),
        tile_text_color: translation
            .and_then(|tr| tr.tile_text_color.clone())
            .or(feature_manifest.tile_text_color)
            .unwrap_or(DEFAULT_TILE_TEXT_COLOR.to_string()),
        links,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use pretty_assertions::assert_eq;
    use std::collections::HashMap;

    impl Default for DecodedFeatureManifest {
        fn default() -> Self {
            DecodedFeatureManifest {
                name: Some("name".to_string()),
                author: Some("author".to_string()),
                version: Some("version".to_string()),
                description: Some("description".to_string()),
                thumbnail: Some("thumbnail".to_string()),
                primary_color: Some("primary_color".to_string()),
                thumbnail_color: Some("thumbnail_color".to_string()),
                border_color: Some("border_color".to_string()),
                tile_text_color: Some("tile_text_color".to_string()),
                links: Some(HashMap::from([(
                    "some_link".to_string(),
                    "https://some_link.com".to_string(),
                )])),
                translations: None,
            }
        }
    }

    struct MockFileSystem {
        contents_of_file_requests_stub: HashMap<String, Result<Vec<u8>, CoreFailure>>,
    }

    impl FileSystem for MockFileSystem {
        fn read_contents_of_file(&self, path: &str) -> Result<Vec<u8>, CoreFailure> {
            self.contents_of_file_requests_stub
                .get(path)
                .unwrap()
                .clone()
        }
    }

    #[test]
    fn failed_to_load_categories_json_throws_error() {
        let features_dir = "features";
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([(
                features_dir.to_string() + "/categories.json",
                Err(CoreFailure::null_c_string_pointer()),
            )]),
        };
        let result = load_feature_categories(fs, features_dir, "en");
        assert_eq!(result.is_err(), true)
    }

    #[test]
    fn json_is_malformed_throws_error() {
        let features_dir = "features";
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([(
                features_dir.to_string() + "/categories.json",
                Ok("invalid".as_bytes().to_vec()),
            )]),
        };
        let result = load_feature_categories(fs, features_dir, "en");
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
                "id":"knowHow",
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
        "#
        .as_bytes()
        .to_vec();
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([(
                features_dir.to_string() + "/categories.json",
                Ok(json),
            )]),
        };
        let loaded_categories = load_feature_categories(fs, features_dir, "en").unwrap();

        let expexcted_categories = vec![
            FeatureCategory {
                id: FeatureCategoryId::YourData,
                name: "Your Data".to_string(),
                features: Vec::new(),
            },
            FeatureCategory {
                id: FeatureCategoryId::KnowHow,
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
                "id":"knowHow",
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
        "#
        .as_bytes()
        .to_vec();
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([(
                features_dir.to_string() + "/categories.json",
                Ok(json),
            )]),
        };
        let loaded_categories = load_feature_categories(fs, features_dir, "en").unwrap();
        let loaded_category_ids: Vec<_> = loaded_categories
            .into_iter()
            .map(|category| category.id)
            .collect();

        let expected_ids = vec![FeatureCategoryId::YourData, FeatureCategoryId::Tools];
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
        "#
        .as_bytes()
        .to_vec();
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([
                (features_dir.to_string() + "/categories.json", Ok(json)),
                (
                    features_dir.to_string() + "/facebookImporter/manifest.json",
                    Err(any_error()),
                ),
            ]),
        };
        let loaded_categories = load_feature_categories(fs, features_dir, "en");
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
        "#
        .as_bytes()
        .to_vec();
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([
                (features_dir.to_string() + "/categories.json", Ok(json)),
                (
                    features_dir.to_string() + "/facebookImporter/manifest.json",
                    Ok("invalid".as_bytes().to_vec()),
                ),
            ]),
        };
        let loaded_categories = load_feature_categories(fs, features_dir, "en");
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
        "#
        .as_bytes()
        .to_vec();
        let fs = MockFileSystem {
            contents_of_file_requests_stub: HashMap::from([
                (features_dir.to_string() + "/categories.json", Ok(json)),
                (
                    features_dir.to_string() + "/facebookImporter/manifest.json",
                    Ok("{}".as_bytes().to_vec()),
                ),
                (
                    features_dir.to_string() + "/lexicon/manifest.json",
                    Ok("{}".as_bytes().to_vec()),
                ),
                (
                    features_dir.to_string() + "/googleImporter/manifest.json",
                    Ok("{}".as_bytes().to_vec()),
                ),
                (
                    features_dir.to_string() + "/demo/manifest.json",
                    Ok("{}".as_bytes().to_vec()),
                ),
            ]),
        };
        let loaded_categories = load_feature_categories(fs, features_dir, "en").unwrap();
        let your_data_category_features: Vec<_> = loaded_categories[0]
            .clone()
            .features
            .into_iter()
            .map(|feature| feature.id)
            .collect();
        let tools_category_features: Vec<_> = loaded_categories[1]
            .clone()
            .features
            .into_iter()
            .map(|feature| feature.id)
            .collect();
        assert_eq!(
            your_data_category_features,
            vec!["facebookImporter", "lexicon"]
        );
        assert_eq!(tools_category_features, vec!["googleImporter", "demo"]);
    }

    #[test]
    fn map_feature_without_translations() {
        let feature_manifest = DecodedFeatureManifest::default();
        let features_dir = "features";
        let feature_id = "feature_x";
        let feature =
            map_feature(features_dir, feature_id, "en", feature_manifest.clone()).unwrap();
        assert_eq!(feature.path, format!("{}/{}", features_dir, feature_id));
        assert_eq!(feature.id, feature_id.to_string());
        assert_eq!(feature.name, feature_manifest.name.unwrap());
        assert_eq!(feature.author, feature_manifest.author);
        assert_eq!(feature.version, feature_manifest.version);
        assert_eq!(feature.description, feature_manifest.description);
        assert_eq!(
            feature.thumbnail,
            Some(format!(
                "{}/{}/{}",
                features_dir,
                feature_id,
                feature_manifest.thumbnail.unwrap()
            ))
        );
        assert_eq!(
            feature.thumbnail_color,
            feature_manifest.thumbnail_color.unwrap()
        );
        assert_eq!(
            feature.primary_color,
            feature_manifest.primary_color.unwrap()
        );
        assert_eq!(feature.links, feature_manifest.links.unwrap());
        assert_eq!(feature.border_color, feature_manifest.border_color.unwrap());
        assert_eq!(
            feature.tile_text_color,
            feature_manifest.tile_text_color.unwrap()
        );
    }

    #[test]
    fn map_feature_with_translations() {
        let language_code = "de";
        let links = HashMap::from([("some_link".to_string(), "https://example.de/1".to_string())]);
        let translation = DecodedFeatureManifest {
            name: Some("testManifest_de".to_string()),
            author: Some("testAuthor".to_string()),
            version: Some("0.1.2".to_string()),
            description: Some("testDescription_de".to_string()),
            thumbnail: Some("assets/thumbnail.png".to_string()),
            primary_color: Some("#000000".to_string()),
            thumbnail_color: Some("#FFFFFF".to_string()),
            border_color: Some("#000001".to_string()),
            tile_text_color: Some("#000002".to_string()),
            links: Some(links),
            translations: None,
        };
        let feature_manifest = DecodedFeatureManifest {
            links: Some(HashMap::from([
                ("some_link".to_string(), "https://some_link.com".to_string()),
                (
                    "different_link".to_string(),
                    "https://different_link.com".to_string(),
                ),
            ])),
            translations: Some(HashMap::from([(
                language_code.to_string(),
                translation.clone(),
            )])),
            ..Default::default()
        };
        let features_dir = "features";
        let feature_id = "feature_x";
        let feature = map_feature(
            features_dir,
            feature_id,
            language_code,
            feature_manifest.clone(),
        )
        .unwrap();
        assert_eq!(feature.path, format!("{}/{}", features_dir, feature_id));
        assert_eq!(feature.id, feature_id.to_string());
        assert_eq!(feature.name, translation.name.unwrap());
        assert_eq!(feature.author, translation.author);
        assert_eq!(feature.version, translation.version);
        assert_eq!(feature.description, translation.description);
        assert_eq!(
            feature.thumbnail,
            Some(format!(
                "{}/{}/{}",
                features_dir,
                feature_id,
                translation.thumbnail.unwrap()
            ))
        );
        assert_eq!(
            feature.thumbnail_color,
            translation.thumbnail_color.unwrap()
        );
        assert_eq!(feature.primary_color, translation.primary_color.unwrap());
        assert_eq!(
            feature.links,
            HashMap::from([
                ("some_link".to_string(), "https://example.de/1".to_string()),
                (
                    "different_link".to_string(),
                    "https://different_link.com".to_string()
                ),
            ])
        );
        assert_eq!(feature.border_color, translation.border_color.unwrap());
        assert_eq!(
            feature.tile_text_color,
            translation.tile_text_color.unwrap()
        );
    }

    #[test]
    fn map_feature_sets_correct_defaults() {
        let feature_manifest = DecodedFeatureManifest {
            name: None,
            primary_color: None,
            thumbnail_color: None,
            border_color: None,
            tile_text_color: None,
            ..Default::default()
        };
        let features_dir = "features";
        let feature_id = "feature_x";
        let feature =
            map_feature(features_dir, feature_id, "en", feature_manifest.clone()).unwrap();
        assert_eq!(feature.name, feature_id.to_string());
        assert_eq!(feature.primary_color, "#ffffff".to_string());
        assert_eq!(feature.thumbnail_color, feature.primary_color);
        assert_eq!(feature.border_color, feature.thumbnail_color);
        assert_eq!(feature.tile_text_color, "#000000".to_string());
    }

    fn any_error() -> CoreFailure {
        CoreFailure::failed_to_parse_feature_manifest("any".to_string())
    }
}
