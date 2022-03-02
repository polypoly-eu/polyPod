use super::kernel_failure_fbs_mapping::build_failure_fbs;
use crate::flatbuffers_generated::{
    feature_manifest_generated::feature_manifest::{FeatureManifest, Link, LinkArgs},
    feature_manifest_response_generated::feature_manifest_response::FeatureManifestParsingResult,
};
use crate::{
    feature_manifest_parsing,
    flatbuffers_generated::{
        feature_manifest_generated::feature_manifest::FeatureManifestArgs,
        feature_manifest_response_generated::feature_manifest_response::{
            finish_feature_manifest_parsing_response_buffer, FeatureManifestParsingResponse,
            FeatureManifestParsingResponseArgs,
        },
    },
    kernel_failure::KernelFailure,
};
use flatbuffers::{FlatBufferBuilder, ForwardsUOffset, Vector, WIPOffset};
use std::collections::HashMap;

pub fn build_feature_manifest_parsing_response(
    result: Result<feature_manifest_parsing::FeatureManifest, KernelFailure>,
) -> Vec<u8> {
    let mut fbb = FlatBufferBuilder::new();
    let response_args = match result {
        Ok(manifest) => build_sucess_response_args(&mut fbb, manifest),
        Err(error) => build_failure_response_args(&mut fbb, error),
    };

    let response = FeatureManifestParsingResponse::create(&mut fbb, &response_args);
    finish_feature_manifest_parsing_response_buffer(&mut fbb, response);
    fbb.finished_data().to_owned()
}

fn build_sucess_response_args(
    fbb: &mut FlatBufferBuilder,
    manifest: feature_manifest_parsing::FeatureManifest,
) -> FeatureManifestParsingResponseArgs {
    let manifest_args = FeatureManifestArgs {
        name: manifest.name.map(|name| fbb.create_string(name.as_str())),
        author: manifest
            .author
            .map(|author| fbb.create_string(author.as_str())),
        version: manifest
            .version
            .map(|version| fbb.create_string(version.as_str())),
        description: manifest
            .description
            .map(|description| fbb.create_string(description.as_str())),
        thumbnail: manifest
            .thumbnail
            .map(|thumbnail| fbb.create_string(thumbnail.as_str())),
        thumbnail_color: manifest
            .thumbnail_color
            .map(|thumbnail_color| fbb.create_string(thumbnail_color.as_str())),
        primary_color: manifest
            .primary_color
            .map(|primary_color| fbb.create_string(primary_color.as_str())),
        links: manifest
            .links
            .and_then(|links| build_links_buffer(fbb, links)),
    };

    let feature_manifest = FeatureManifest::create(fbb, &manifest_args).as_union_value();
    FeatureManifestParsingResponseArgs {
        result_type: FeatureManifestParsingResult::feature_manifest_FeatureManifest,
        result: Some(feature_manifest),
    }
}

fn build_failure_response_args(
    fbb: &mut FlatBufferBuilder,
    failure: KernelFailure,
) -> FeatureManifestParsingResponseArgs {
    let failure = build_failure_fbs(fbb, failure).as_union_value();
    FeatureManifestParsingResponseArgs {
        result_type: FeatureManifestParsingResult::failure_Failure,
        result: Some(failure),
    }
}

fn build_links_buffer<'a>(
    fbb: &mut FlatBufferBuilder<'a>,
    links: HashMap<String, String>,
) -> Option<WIPOffset<Vector<'a, ForwardsUOffset<Link<'a>>>>> {
    let links: Vec<_> = links
        .into_iter()
        .map(|(name, url)| {
            let args = LinkArgs {
                name: Some(fbb.create_string(name.as_str())),
                url: Some(fbb.create_string(url.as_str())),
            };
            Link::create(fbb, &args)
        })
        .collect();
    if !links.is_empty() {
        Some(fbb.create_vector(&links))
    } else {
        None
    }
}

#[cfg(test)]
mod tests { 
    use crate::flatbuffers_generated::feature_manifest_response_generated::feature_manifest_response::root_as_feature_manifest_parsing_response;

    use super::*;

    #[test]
    fn test_build_failure() {
        let expected_failure = KernelFailure::failed_to_parse_feature_manifest("Some missing field".to_string());
        let byte_response = build_feature_manifest_parsing_response(Err(expected_failure.clone()));
        let parsed = root_as_feature_manifest_parsing_response(&byte_response);
        assert!(parsed.is_ok(), "Expected response parsing to be successfull");
        let response = parsed.unwrap();

        let failure = response.result_as_failure_failure();
        assert!(failure.is_some(), "Expected response to contain failure");

        let failure = failure.unwrap();
        assert_eq!(failure.code(), expected_failure.code);
        assert_eq!(failure.message(), Some(expected_failure.message.as_str()));
    }

    #[test]
    fn test_build_success() {
        let expected_manifest = feature_manifest_parsing::FeatureManifest {
            name: Some("name".to_string()),
            author: Some("author".to_string()),
            version: Some("version".to_string()),
            description: Some("description".to_string()),
            thumbnail: Some("thumbnail".to_string()),
            thumbnail_color: Some("thumbnail_color".to_string()),
            primary_color: Some("primary_color".to_string()),
            links: Some(HashMap::from([("link1".to_string(), "https://any.link".to_string())])),
        };
        let byte_response = build_feature_manifest_parsing_response(Ok(expected_manifest.clone()));

        let parsed = root_as_feature_manifest_parsing_response(&byte_response);
        assert!(parsed.is_ok(), "Expected response parsing to be successfull");

        let response = parsed.unwrap();
        let parsed_manifest = response.result_as_feature_manifest_feature_manifest();
        assert!(parsed_manifest.is_some(), "Expected response to contain manifest");

        let parsed_manifest = parsed_manifest.unwrap();
        assert_eq!(parsed_manifest.name().map(String::from), expected_manifest.name);
        assert_eq!(parsed_manifest.author().map(String::from), expected_manifest.author);
        assert_eq!(parsed_manifest.version().map(String::from), expected_manifest.version);
        assert_eq!(parsed_manifest.description().map(String::from), expected_manifest.description);
        assert_eq!(parsed_manifest.thumbnail().map(String::from), expected_manifest.thumbnail);
        assert_eq!(parsed_manifest.thumbnail_color().map(String::from), expected_manifest.thumbnail_color);
        assert_eq!(parsed_manifest.primary_color().map(String::from), expected_manifest.primary_color);
        
        let mut parsed_links: HashMap<String, String> = HashMap::new();
        for link in parsed_manifest.links().unwrap() {
            parsed_links.insert(link.name().unwrap().to_string(), link.url().unwrap().to_string());
        }

        assert_eq!(parsed_links, expected_manifest.links.unwrap());
    }
}