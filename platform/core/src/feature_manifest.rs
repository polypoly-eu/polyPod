use crate::kernel_failure::KernelFailure;
use serde::Deserialize;
use std::collections::HashMap;

#[derive(Deserialize, PartialEq, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FeatureManifest {
    pub name: Option<String>,
    pub author: Option<String>,
    pub version: Option<String>,
    pub description: Option<String>,
    pub thumbnail: Option<String>,
    pub thumbnail_color: Option<String>,
    pub primary_color: Option<String>,
    pub links: Option<HashMap<String, String>>,
}

// Alias for str, probably will be moved to a centralized place to be reused
pub type JSONStr = str;

impl FeatureManifest {
    pub fn parse(json: &JSONStr, language_code: &str) -> Result<FeatureManifest, KernelFailure> {
        FullFeatureManifest::try_from(json)
            .map(|manifest| FeatureManifest::build_feature_manifest(manifest, language_code))
            .map_err(KernelFailure::failed_to_parse_feature_manifest)
    }

    fn build_feature_manifest(
        full_manifest: FullFeatureManifest,
        language_code: &str,
    ) -> FeatureManifest {
        let translation = full_manifest
            .translations
            .as_ref()
            .and_then(|unwrapped| unwrapped.get(language_code));

        let mut links = full_manifest.links.unwrap_or_default();
        if let Some(translated_links) = translation.and_then(|manifest| manifest.links.clone()) {
            links.extend(translated_links.into_iter());
        }
        let links = if !links.is_empty() { Some(links) } else { None };

        FeatureManifest {
            name: translation
                .and_then(|manifest| manifest.name.clone())
                .or(full_manifest.name),
            author: translation
                .and_then(|manifest| manifest.author.clone())
                .or(full_manifest.author),
            version: translation
                .and_then(|manifest| manifest.version.clone())
                .or(full_manifest.version),
            description: translation
                .and_then(|manifest| manifest.description.clone())
                .or(full_manifest.description),
            thumbnail: translation
                .and_then(|manifest| manifest.thumbnail.clone())
                .or(full_manifest.thumbnail),
            thumbnail_color: translation
                .and_then(|manifest| manifest.thumbnail_color.clone())
                .or(full_manifest.thumbnail_color),
            primary_color: translation
                .and_then(|manifest| manifest.primary_color.clone())
                .or(full_manifest.primary_color),
            links,
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct FullFeatureManifest {
    name: Option<String>,
    author: Option<String>,
    version: Option<String>,
    description: Option<String>,
    thumbnail: Option<String>,
    thumbnail_color: Option<String>,
    primary_color: Option<String>,
    links: Option<HashMap<String, String>>,
    translations: Option<HashMap<String, FeatureManifest>>,
}

impl TryFrom<&JSONStr> for FullFeatureManifest {
    type Error = String;

    fn try_from(value: &JSONStr) -> Result<Self, Self::Error> {
        serde_json::from_str(value).map_err(|err| err.to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn default_manifest() -> FeatureManifest {
        FeatureManifest {
            name: None,
            author: None,
            version: None,
            description: None,
            thumbnail: None,
            thumbnail_color: None,
            primary_color: None,
            links: None,
        }
    }

    #[test]
    fn test_empty_json() {
        let parsed = FeatureManifest::parse("", "");

        assert!(parsed.is_err())
    }

    #[test]
    fn test_empty_json_object() {
        let parsed = FeatureManifest::parse("{}", "");

        assert_eq!(parsed.unwrap(), default_manifest())
    }

    #[test]
    fn test_wrong_json() {
        let parsed = FeatureManifest::parse(r#"{ "somethingElse": true }"#, "");

        assert_eq!(parsed.unwrap(), default_manifest())
    }

    #[test]
    fn test_partial_json() {
        let json = r#"
        {
            "name": "testManifest",
            "description": "testDescription",
            "author": "testAuthor",
            "thumbnail": "assets/thumbnail.png"
        }"#;

        let parsed = FeatureManifest::parse(json, "").unwrap();

        assert_eq!(parsed.name.unwrap(), "testManifest");
        assert_eq!(parsed.description.unwrap(), "testDescription");
        assert_eq!(parsed.author.unwrap(), "testAuthor");
        assert_eq!(parsed.thumbnail.unwrap(), "assets/thumbnail.png");
    }

    #[test]
    fn test_no_translations() {
        let json = r##"
        {
            "name": "testManifest",
            "author": "testAuthor",
            "version": "0.1.2",
            "description": "testDescription",
            "thumbnail": "assets/thumbnail.png",
            "thumbnailColor": "#FFFFFF",
            "primaryColor": "#000000",
            "links": {
                "link1": "https://example.com/1",
                "link2": "https://example.com/2"
            }
        }"##;

        let expected_links = HashMap::from([
            ("link1".to_string(), "https://example.com/1".to_string()),
            ("link2".to_string(), "https://example.com/2".to_string()),
        ]);
        let expected_manifest = FeatureManifest {
            name: Some("testManifest".to_string()),
            author: Some("testAuthor".to_string()),
            version: Some("0.1.2".to_string()),
            description: Some("testDescription".to_string()),
            thumbnail: Some("assets/thumbnail.png".to_string()),
            thumbnail_color: Some("#FFFFFF".to_string()),
            primary_color: Some("#000000".to_string()),
            links: Some(expected_links),
        };

        let parsed = FeatureManifest::parse(json, "").unwrap();

        assert_eq!(parsed.name, expected_manifest.name);
        assert_eq!(parsed.author, expected_manifest.author);
        assert_eq!(parsed.version, expected_manifest.version);
        assert_eq!(parsed.description, expected_manifest.description);
        assert_eq!(parsed.thumbnail, expected_manifest.thumbnail);
        assert_eq!(parsed.thumbnail_color, expected_manifest.thumbnail_color);
        assert_eq!(parsed.primary_color, expected_manifest.primary_color);
        assert_eq!(parsed.links, expected_manifest.links);
    }

    #[test]
    fn test_has_translations() {
        let json = r##"
        {
            "name": "testManifest",
            "author": "testAuthor",
            "version": "0.1.2",
            "description": "testDescription",
            "thumbnail": "assets/thumbnail.png",
            "thumbnailColor": "#FFFFFF",
            "primaryColor": "#000000",
            "links": {
                "link1": "https://example.com/1",
                "link2": "https://example.com/2"
            },
            "translations": {
                "de": {
                    "name": "testManifest_de",
                    "description": "testDescription_de",
                    "links": {
                        "link1": "https://example.de/1"
                    }
                }
            }
        }"##;

        let expected_links = HashMap::from([
            ("link1".to_string(), "https://example.de/1".to_string()),
            ("link2".to_string(), "https://example.com/2".to_string()),
        ]);
        let expected_manifest = FeatureManifest {
            name: Some("testManifest_de".to_string()),
            author: Some("testAuthor".to_string()),
            version: Some("0.1.2".to_string()),
            description: Some("testDescription_de".to_string()),
            thumbnail: Some("assets/thumbnail.png".to_string()),
            thumbnail_color: Some("#FFFFFF".to_string()),
            primary_color: Some("#000000".to_string()),
            links: Some(expected_links),
        };

        let parsed = FeatureManifest::parse(json, "de").unwrap();

        assert_eq!(parsed.name, expected_manifest.name);
        assert_eq!(parsed.author, expected_manifest.author);
        assert_eq!(parsed.version, expected_manifest.version);
        assert_eq!(parsed.description, expected_manifest.description);
        assert_eq!(parsed.thumbnail, expected_manifest.thumbnail);
        assert_eq!(parsed.thumbnail_color, expected_manifest.thumbnail_color);
        assert_eq!(parsed.primary_color, expected_manifest.primary_color);
        assert_eq!(parsed.links, expected_manifest.links);
    }
}
