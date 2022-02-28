use flatbuffers::{FlatBufferBuilder};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::{feature_manifest_response_generated::feature_manifest_response::{FeatureManifestParsingResponse, FeatureManifestParsingResult, FeatureManifestParsingResponseArgs, FeatureManifestParsingResultUnionTableOffset, finish_size_prefixed_feature_manifest_parsing_response_buffer, finish_feature_manifest_parsing_response_buffer}, failure_generated::failure::{Failure, FailureBuilder, FailureArgs, FailureCode}, feature_manifest_generated::feature_manifest::{FeatureManifestArgs, FeatureManifest, LinkArgs, Link}};

fn parse_feature_manifest(
    json: &JSONStr,
    language_code: &str,
) -> Vec<u8> {
    let mut fbb = FlatBufferBuilder::new();
    let full_manifest = FullFeatureManifest::try_from(json);
    match full_manifest {
        Ok(full_manifest) => {
            let translation = full_manifest
                .translations
                .as_ref()
                .and_then(|unwrapped| unwrapped.get(language_code));
            match translation {
                Some(translation) => {
                    let mut links = full_manifest.links.unwrap_or_default();
                    if let Some(translated_links) = translation.links.clone() {
                        links.extend(translated_links.into_iter());
                    }

                    let links: Vec<_> = links.into_iter().map(|(name, url)| {
                        let args = LinkArgs {
                            name: Some(fbb.create_string(name.as_str())),
                            url: Some(fbb.create_string(url.as_str())),
                        };
                        Link::create(&mut fbb, &args)
                    }).collect();
                    let links = fbb.create_vector(&links);


                    let manifest_args = FeatureManifestArgs {
                        name: translation
                            .name
                            .clone()
                            .or(full_manifest.name)
                            .and_then(|name| Some(fbb.create_string(name.as_str()))),
                        author: translation
                            .author
                            .clone()
                            .or(full_manifest.author)
                            .and_then(|author| Some(fbb.create_string(author.as_str()))),
                        version: translation
                            .version
                            .clone()
                            .or(full_manifest.version)
                            .and_then(|version| Some(fbb.create_string(version.as_str()))),
                        description: translation
                            .description
                            .clone()
                            .or(full_manifest.description)
                            .and_then(|description| Some(fbb.create_string(description.as_str()))),
                        thumbnail: translation
                            .thumbnail
                            .clone()
                            .or(full_manifest.thumbnail)
                            .and_then(|thumbnail| Some(fbb.create_string(thumbnail.as_str()))),
                        thumbnail_color: translation
                            .thumbnail_color
                            .clone()
                            .or(full_manifest.thumbnail_color)
                            .and_then(|thumbnail_color| Some(fbb.create_string(thumbnail_color.as_str()))),
                        primary_color: translation
                            .primary_color
                            .clone()
                            .or(full_manifest.primary_color)
                            .and_then(|primary_color| Some(fbb.create_string(primary_color.as_str()))),
                        links: Some(links),
                    };
                    let feature_manifest = FeatureManifest::create(&mut fbb, &manifest_args).as_union_value();
                    let args = FeatureManifestParsingResponseArgs {
                        result_type: FeatureManifestParsingResult::feature_manifest_FeatureManifest,
                        result: Some(feature_manifest),
                    };
                    let response = FeatureManifestParsingResponse::create(&mut fbb, &args);
                    finish_feature_manifest_parsing_response_buffer(&mut fbb, response);
                    fbb.finished_data().to_owned()
                },
                None => {
                    let mut links = full_manifest.links.unwrap_or_default();

                    let links: Vec<_> = links.into_iter().map(|(name, url)| {
                        let args = LinkArgs {
                            name: Some(fbb.create_string(name.as_str())),
                            url: Some(fbb.create_string(url.as_str())),
                        };
                        Link::create(&mut fbb, &args)
                    }).collect();
                    let links = if !links.is_empty() { Some(fbb.create_vector(&links)) } else { None };

                    let manifest_args = FeatureManifestArgs {
                        name: full_manifest
                            .name
                            .and_then(|name| Some(fbb.create_string(name.as_str()))),
                        author: full_manifest
                            .author
                            .and_then(|author| Some(fbb.create_string(author.as_str()))),
                        version: full_manifest
                            .version
                            .and_then(|version| Some(fbb.create_string(version.as_str()))),
                        description: full_manifest
                            .description
                            .and_then(|description| Some(fbb.create_string(description.as_str()))),
                        thumbnail: full_manifest
                            .thumbnail
                            .and_then(|thumbnail| Some(fbb.create_string(thumbnail.as_str()))),
                        thumbnail_color: full_manifest
                            .thumbnail_color
                            .and_then(|thumbnail_color| Some(fbb.create_string(thumbnail_color.as_str()))),
                        primary_color: full_manifest
                            .primary_color
                            .and_then(|primary_color| Some(fbb.create_string(primary_color.as_str()))),
                        links: links,
                    };

                    let feature_manifest = FeatureManifest::create(&mut fbb, &manifest_args).as_union_value();
                    let args = FeatureManifestParsingResponseArgs {
                        result_type: FeatureManifestParsingResult::feature_manifest_FeatureManifest,
                        result: Some(feature_manifest),
                    };
                    let response = FeatureManifestParsingResponse::create(&mut fbb, &args);
                    finish_feature_manifest_parsing_response_buffer(&mut fbb, response);
                    fbb.finished_data().to_owned()
                }
            }
        }
        Err(error) => {
            let failure_args = FailureArgs {
                code: FailureCode::FailedToParseFeatureManifest,
                message: Some(fbb.create_string("some failure")),
            };
            let failure = Failure::create(&mut fbb, &failure_args).as_union_value();
            let args = FeatureManifestParsingResponseArgs {
                result_type: FeatureManifestParsingResult::failure_Failure,
                result: Some(failure),
            };
        
            let response = FeatureManifestParsingResponse::create(&mut fbb, &args);
            finish_feature_manifest_parsing_response_buffer(&mut fbb, response);
            fbb.finished_data().to_owned()
        }
    }
}

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

#[derive(PartialEq, Debug)]
pub struct FeatureManifestParsingError {
    pub description: String,
}

// Alias for str, probably will be moved to a centralized place to be reused
pub type JSONStr = str;

// #[allow(dead_code)] // Temporary until exposed through C API
// impl FeatureManifest {
//     pub fn parse(
//         json: &JSONStr,
//         language_code: &str,
//     ) -> Result<FeatureManifest, FeatureManifestParsingError> {
//         FullFeatureManifest::try_from(json)
//             .map(|manifest| FeatureManifest::build_feature_manifest(manifest, language_code))
//     }

//     fn build_feature_manifest(
//         full_manifest: FullFeatureManifest,
//         language_code: &str,
//     ) -> FeatureManifest {
//         let translation = full_manifest
//             .translations
//             .as_ref()
//             .and_then(|unwrapped| unwrapped.get(language_code));

//         match translation {
//             Some(translation) => {
//                 let mut links = full_manifest.links.unwrap_or_default();
//                 if let Some(translated_links) = translation.links.clone() {
//                     links.extend(translated_links.into_iter());
//                 }
//                 FeatureManifest {
//                     name: translation.name.clone().or(full_manifest.name),
//                     author: translation.author.clone().or(full_manifest.author),
//                     version: translation.version.clone().or(full_manifest.version),
//                     description: translation
//                         .description
//                         .clone()
//                         .or(full_manifest.description),
//                     thumbnail: translation.thumbnail.clone().or(full_manifest.thumbnail),
//                     thumbnail_color: translation
//                         .thumbnail_color
//                         .clone()
//                         .or(full_manifest.thumbnail_color),
//                     primary_color: translation
//                         .primary_color
//                         .clone()
//                         .or(full_manifest.primary_color),
//                     links: Some(links),
//                 }
//             }
//             None => FeatureManifest {
//                 name: full_manifest.name,
//                 author: full_manifest.author,
//                 version: full_manifest.version,
//                 description: full_manifest.description,
//                 thumbnail: full_manifest.thumbnail,
//                 thumbnail_color: full_manifest.thumbnail_color,
//                 primary_color: full_manifest.primary_color,
//                 links: full_manifest.links,
//             },
//         }
//     }

//     fn default() -> FeatureManifest {
//         FeatureManifest {
//             name: None,
//             author: None,
//             version: None,
//             description: None,
//             thumbnail: None,
//             thumbnail_color: None,
//             primary_color: None,
//             links: None,
//         }
//     }
// }

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
    type Error = FeatureManifestParsingError;

    fn try_from(value: &JSONStr) -> Result<Self, Self::Error> {
        serde_json::from_str(value).map_err(|err| FeatureManifestParsingError {
            description: err.to_string(),
        })
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
        assert_eq!(links.get(0).name(), Some("link1"));
        assert_eq!(links.get(0).url(), Some("https://example.com/1"));
        assert_eq!(manifest.name(), Some("testManifest"));
        assert_eq!(manifest.author(), Some("testAuthor"));
        assert_eq!(manifest.version(), Some("0.1.2"));
        assert_eq!(manifest.description(), Some("testDescription"));
        assert_eq!(manifest.thumbnail(), Some("assets/thumbnail.png"));
        assert_eq!(manifest.thumbnail_color(), Some("#FFFFFF"));
        assert_eq!(manifest.primary_color(), Some("#000000"));
        assert_eq!(parsedLinks, expected_links);
    }

    // #[test]
    // fn test_has_translations() {
    //     let json = r##"
    //     {
    //         "name": "testManifest",
    //         "author": "testAuthor",
    //         "version": "0.1.2",
    //         "description": "testDescription",
    //         "thumbnail": "assets/thumbnail.png",
    //         "thumbnailColor": "#FFFFFF",
    //         "primaryColor": "#000000",
    //         "links": {
    //             "link1": "https://example.com/1",
    //             "link2": "https://example.com/2"
    //         },
    //         "translations": {
    //             "de": {
    //                 "name": "testManifest_de",
    //                 "description": "testDescription_de",
    //                 "links": {
    //                     "link1": "https://example.de/1"
    //                 }
    //             }
    //         }
    //     }"##;

    //     let expected_links = HashMap::from([
    //         ("link1".to_string(), "https://example.de/1".to_string()),
    //         ("link2".to_string(), "https://example.com/2".to_string()),
    //     ]);
    //     let expected_manifest = FeatureManifest {
    //         name: Some("testManifest_de".to_string()),
    //         author: Some("testAuthor".to_string()),
    //         version: Some("0.1.2".to_string()),
    //         description: Some("testDescription_de".to_string()),
    //         thumbnail: Some("assets/thumbnail.png".to_string()),
    //         thumbnail_color: Some("#FFFFFF".to_string()),
    //         primary_color: Some("#000000".to_string()),
    //         links: Some(expected_links),
    //     };

    //     let parsed = FeatureManifest::parse(json, "de").unwrap();

    //     assert_eq!(parsed.name, expected_manifest.name);
    //     assert_eq!(parsed.author, expected_manifest.author);
    //     assert_eq!(parsed.version, expected_manifest.version);
    //     assert_eq!(parsed.description, expected_manifest.description);
    //     assert_eq!(parsed.thumbnail, expected_manifest.thumbnail);
    //     assert_eq!(parsed.thumbnail_color, expected_manifest.thumbnail_color);
    //     assert_eq!(parsed.primary_color, expected_manifest.primary_color);
    //     assert_eq!(parsed.links, expected_manifest.links);
    // }
}
