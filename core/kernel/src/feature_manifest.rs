use std::collections::HashMap;
use serde::{Deserialize};

#[derive(Deserialize, PartialEq, Debug)]
pub struct FeatureManifest {
    // Everything is Option? interesting
    name: Option<String>,
    author: Option<String>,
    version: Option<String>,
    description: Option<String>,
    thumbnail: Option<String>,
    thumbnail_color: Option<String>,
    primary_color: Option<String>,
    links: Option<HashMap<String, String>>
}

#[derive(Deserialize)]
struct FullFeatureManifest {
    name: Option<String>,
    author: Option<String>,
    version: Option<String>,
    description: Option<String>,
    thumbnail: Option<String>,
    thumbnail_color: Option<String>,
    primary_color: Option<String>,
    links: Option<HashMap<String, String>>,
    translations: Option<HashMap<String, FeatureManifest>>
}

// Alias for str, probably will be moved to a centralized place to be reused
pub type JSONString = str;

impl FeatureManifest {
    // Hmm, maybe add typed error so the caler can decide based on error. 
    fn parse(json: &JSONString, locale: &str) -> FeatureManifest {
        FullFeatureManifest::try_from(json)
        .map(FeatureManifest::build_feature_manifest)
        .unwrap_or(FeatureManifest::default())
    }

    fn default() -> FeatureManifest {
        FeatureManifest {
            name: None,
            author: None,
            version: None,
            description: None,
            thumbnail: None,
            thumbnail_color: None,
            primary_color: None,
            links: None
        }
    }

    fn build_feature_manifest(full_manifest: FullFeatureManifest) -> FeatureManifest {
        FeatureManifest {
            name: full_manifest.name,
            author: full_manifest.author,
            version: full_manifest.version,
            description: full_manifest.description,
            thumbnail: full_manifest.thumbnail,
            thumbnail_color: full_manifest.thumbnail_color,
            primary_color: full_manifest.primary_color,
            links: full_manifest.links
        }
    }
}


impl TryFrom<&JSONString> for FullFeatureManifest {
    type Error = String;

    fn try_from(value: &JSONString) -> Result<Self, Self::Error> {
        serde_json::from_str(value).map_err(|err| err.to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_json() {
        let parsed = FeatureManifest::parse("", "");

        assert_eq!(parsed, FeatureManifest::default(), "Expected to return default manifest if json is empty")
    }

    #[test]
    fn test_empty_json_object() {
        let parsed = FeatureManifest::parse("{}", "");

        assert_eq!(parsed, FeatureManifest::default())
    }

    #[test]
    fn test_wrong_json() {
        let parsed = FeatureManifest::parse(r#"{ "somethingElse": true }"#, "");

        assert_eq!(parsed, FeatureManifest::default())
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

        let parsed = FeatureManifest::parse(json, "");

        assert_eq!(parsed.name.unwrap(), "testManifest");
        assert_eq!(parsed.description.unwrap(), "testDescription");
        assert_eq!(parsed.author.unwrap(), "testAuthor");
        assert_eq!(parsed.thumbnail.unwrap(), "assets/thumbnail.png");
    }
}
