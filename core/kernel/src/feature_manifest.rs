use std::collections::HashMap;
use serde::{Deserialize};

#[derive(Deserialize)]
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

type JSONString = str;

impl TryFrom<&JSONString> for FullFeatureManifest {
    type Error = String;

    fn try_from(value: &JSONString) -> Result<Self, Self::Error> {
        serde_json::from_str(value).map_err(|err| err.to_string())
    }
}