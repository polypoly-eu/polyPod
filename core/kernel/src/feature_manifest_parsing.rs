use flatbuffers::{FlatBufferBuilder, WIPOffset, Vector, ForwardsUOffset};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap};

use crate::{
    feature_manifest_response_generated::feature_manifest_response::{FeatureManifestParsingResponse, FeatureManifestParsingResult, FeatureManifestParsingResponseArgs, FeatureManifestParsingResultUnionTableOffset, finish_feature_manifest_parsing_response_buffer}, failure_generated::failure::{Failure, FailureArgs, FailureCode}, feature_manifest_generated::feature_manifest::{FeatureManifestArgs, FeatureManifest, LinkArgs, Link}};

// Alias for str, probably will be moved to a centralized place to be reused
pub type JSONStr = str;

pub fn parse_feature_manifest(
    json: &JSONStr,
    language_code: &str,
) -> Vec<u8> {
    let mut fbb = FlatBufferBuilder::new();
    let full_manifest = FullFeatureManifest::try_from(json);

    let response_args = match full_manifest {
        Ok(full_manifest) => build_sucess_response_args(&mut fbb, full_manifest, language_code),
        Err(error) => build_failure_response_args(&mut fbb, error)
    };

    let response = FeatureManifestParsingResponse::create(&mut fbb, &response_args);
    finish_feature_manifest_parsing_response_buffer(&mut fbb, response);
    fbb.finished_data().to_owned()
}

fn build_sucess_response_args(
    fbb: &mut FlatBufferBuilder,
    full_manifest: FullFeatureManifest,
    language_code: &str
) -> FeatureManifestParsingResponseArgs {
    let translation = full_manifest
        .translations
        .as_ref()
        .and_then(|unwrapped| unwrapped.get(language_code));
            
    let mut links = full_manifest.links.unwrap_or_default();
    if let Some(translated_links) = translation.and_then(|manifest| manifest.links.clone()) {
        links.extend(translated_links.into_iter());
    }
    
    let manifest_args = FeatureManifestArgs {
        name: build_translated_field(
            fbb,
            translation.and_then(|manifest| manifest.name.clone()),
            full_manifest.name, 
        ),
        author: build_translated_field(
            fbb,
            translation.and_then(|manifest| manifest.author.clone()),
            full_manifest.author, 
        ),
        version: build_translated_field(
            fbb,
            translation.and_then(|manifest| manifest.version.clone()),
            full_manifest.version, 
        ),
        description: build_translated_field(
            fbb,
            translation.and_then(|manifest| manifest.description.clone()),
            full_manifest.description, 
        ),
        thumbnail: build_translated_field(
            fbb,
            translation.and_then(|manifest| manifest.thumbnail.clone()),
            full_manifest.thumbnail, 
        ),
        thumbnail_color: build_translated_field(
            fbb,
            translation.and_then(|manifest| manifest.thumbnail_color.clone()),
            full_manifest.thumbnail_color, 
        ),
        primary_color: build_translated_field(
            fbb,
            translation.and_then(|manifest| manifest.primary_color.clone()),
            full_manifest.primary_color, 
        ),
        links: build_links_buffer(fbb, links),
    };

    let feature_manifest = FeatureManifest::create(fbb, &manifest_args).as_union_value();
    FeatureManifestParsingResponseArgs {
        result_type: FeatureManifestParsingResult::feature_manifest_FeatureManifest,
        result: Some(feature_manifest),
    } 
}

fn build_failure_response_args(
    fbb: &mut FlatBufferBuilder,
    error: String,
) -> FeatureManifestParsingResponseArgs {
    let failure_args = FailureArgs {
        code: FailureCode::FailedToParseFeatureManifest,
        message: Some(fbb.create_string(error.as_str())),
    };
    let failure = Failure::create(fbb, &failure_args).as_union_value();
    FeatureManifestParsingResponseArgs {
        result_type: FeatureManifestParsingResult::failure_Failure,
        result: Some(failure),
    }
}

fn build_translated_field<'a>(
    fbb: &mut FlatBufferBuilder<'a>,
    translation: Option<String>,
    default: Option<String>,
) -> Option<WIPOffset<&'a str>>{
    translation
        .clone()
        .or(default)
        .and_then(|field| Some(fbb.create_string(field.as_str())))
}

fn build_links_buffer<'a>(
    fbb: &mut FlatBufferBuilder<'a>,
    links: HashMap<String, String>,
) -> Option<WIPOffset<Vector<'a, ForwardsUOffset<Link<'a>>>>> {
    let links: Vec<_> = links.into_iter().map(|(name, url)| {
        let args = LinkArgs {
            name: Some(fbb.create_string(name.as_str())),
            url: Some(fbb.create_string(url.as_str())),
        };
        Link::create(fbb, &args)
    }).collect();
    if !links.is_empty() { Some(fbb.create_vector(&links)) } else { None }
}

// ---------- JSON Parsing ---------- //

#[derive(Deserialize, Serialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)] // Temporary until exposed through C API
pub struct JSONFeatureManifest {
    name: Option<String>,
    author: Option<String>,
    version: Option<String>,
    description: Option<String>,
    thumbnail: Option<String>,
    thumbnail_color: Option<String>,
    primary_color: Option<String>,
    links: Option<HashMap<String, String>>,
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
    translations: Option<HashMap<String, JSONFeatureManifest>>,
}

impl TryFrom<&JSONStr> for FullFeatureManifest {
    type Error = String;

    fn try_from(value: &JSONStr) -> Result<Self, Self::Error> {
        serde_json::from_str(value).map_err(|err| err.to_string())
    }
}

#[cfg(test)]
mod tests {
    use crate::feature_manifest_response_generated::feature_manifest_response::{root_as_feature_manifest_parsing_response};

    use super::*;

    #[test]
    fn test_empty_json() {
        let parsed = parse_feature_manifest("", "");
        let response = root_as_feature_manifest_parsing_response(&parsed[..]);
        let failure = response.unwrap().result_as_failure_failure();

        assert!(failure.is_some())
    }

    #[test]
    fn test_empty_json_object() {
        let parsed = parse_feature_manifest("{}", "");
        let response = root_as_feature_manifest_parsing_response(&parsed[..]);
        let manifest = response.unwrap().result_as_feature_manifest_feature_manifest().unwrap();

        assert!(manifest.name().is_none());
        assert!(manifest.author().is_none());
        assert!(manifest.version().is_none());
        assert!(manifest.description().is_none());
        assert!(manifest.thumbnail().is_none());
        assert!(manifest.thumbnail_color().is_none());
        assert!(manifest.primary_color().is_none());
        assert!(manifest.links().is_none());
    }

    #[test]
    fn test_wrong_json() {
        let parsed = parse_feature_manifest(r#"{ "somethingElse": true }"#, "");
        let response = root_as_feature_manifest_parsing_response(&parsed[..]);
        let manifest = response.unwrap().result_as_feature_manifest_feature_manifest().unwrap();

        assert!(manifest.name().is_none());
        assert!(manifest.author().is_none());
        assert!(manifest.version().is_none());
        assert!(manifest.description().is_none());
        assert!(manifest.thumbnail().is_none());
        assert!(manifest.thumbnail_color().is_none());
        assert!(manifest.primary_color().is_none());
        assert!(manifest.links().is_none());
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

        let parsed = parse_feature_manifest(json, "");
        let response = root_as_feature_manifest_parsing_response(&parsed[..]);
        let manifest = response.unwrap().result_as_feature_manifest_feature_manifest().unwrap();

        assert_eq!(manifest.name(), Some("testManifest"));
        assert_eq!(manifest.description(), Some("testDescription"));
        assert_eq!(manifest.author(), Some("testAuthor"));
        assert_eq!(manifest.thumbnail(), Some("assets/thumbnail.png"));
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

        let parsed = parse_feature_manifest(json, "");
        let response = root_as_feature_manifest_parsing_response(&parsed[..]);
        let manifest = response.unwrap().result_as_feature_manifest_feature_manifest().unwrap();

        let expected_links = HashMap::from([
            ("link1".to_string(), "https://example.com/1".to_string()),
            ("link2".to_string(), "https://example.com/2".to_string()),
        ]);

        let links = manifest.links().unwrap();
        let parsedLinks = HashMap::from([
            (links.get(0).name().unwrap().to_owned(), links.get(0).url().unwrap().to_owned()),
            (links.get(1).name().unwrap().to_owned(), links.get(1).url().unwrap().to_owned()),
        ]);

        assert_eq!(manifest.name(), Some("testManifest"));
        assert_eq!(manifest.author(), Some("testAuthor"));
        assert_eq!(manifest.version(), Some("0.1.2"));
        assert_eq!(manifest.description(), Some("testDescription"));
        assert_eq!(manifest.thumbnail(), Some("assets/thumbnail.png"));
        assert_eq!(manifest.thumbnail_color(), Some("#FFFFFF"));
        assert_eq!(manifest.primary_color(), Some("#000000"));
        assert_eq!(parsedLinks, expected_links);
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

        let parsed = parse_feature_manifest(json, "de");
        let response = root_as_feature_manifest_parsing_response(&parsed[..]);
        let manifest = response.unwrap().result_as_feature_manifest_feature_manifest().unwrap();

        let expected_links = HashMap::from([
            ("link1".to_string(), "https://example.de/1".to_string()),
            ("link2".to_string(), "https://example.com/2".to_string()),
        ]);

        let links = manifest.links().unwrap();
        let parsedLinks = HashMap::from([
            (links.get(0).name().unwrap().to_owned(), links.get(0).url().unwrap().to_owned()),
            (links.get(1).name().unwrap().to_owned(), links.get(1).url().unwrap().to_owned()),
        ]);

        assert_eq!(manifest.name(), Some("testManifest_de"));
        assert_eq!(manifest.author(), Some("testAuthor"));
        assert_eq!(manifest.version(), Some("0.1.2"));
        assert_eq!(manifest.description(), Some("testDescription_de"));
        assert_eq!(manifest.thumbnail(), Some("assets/thumbnail.png"));
        assert_eq!(manifest.thumbnail_color(), Some("#FFFFFF"));
        assert_eq!(manifest.primary_color(), Some("#000000"));
        assert_eq!(parsedLinks, expected_links);
    }
}
