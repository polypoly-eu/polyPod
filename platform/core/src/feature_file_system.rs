use std::fs::{DirBuilder, File};
use std::path::Path;
use url::Url;
use uuid::Uuid;
use zip::ZipArchive;

trait PlatformFileSystemTrait: Sized {
    fn create_dir_structure(&self, path: &str) -> Result<(), String>;
    fn exists(&self, path: &str) -> bool;
    fn unzip(&self, from_url: &str, to_url: &str) -> Result<(), String>;
}

struct PlatformFileSystem {}

impl PlatformFileSystemTrait for PlatformFileSystem {
    fn create_dir_structure(&self, path: &str) -> Result<(), String> {
        let path = Path::new(path);
        DirBuilder::new()
            .recursive(true)
            .create(path)
            .map_err(|err| err.to_string())
    }

    fn exists(&self, path: &str) -> bool {
        let path = Path::new(path);
        path.exists()
    }

    fn unzip(&self, from_url: &str, to_url: &str) -> Result<(), String> {
        let file = File::open(Path::new(from_url)).map_err(|err| err.to_string())?;
        let mut archive = ZipArchive::new(file).map_err(|err| err.to_string())?;
        archive
            .extract(Path::new(to_url))
            .map_err(|err| err.to_string())
    }
}

type ResourceUrl = String;
type ResourceId = String;

struct Metadata {
    is_directory: bool,
    size: String,
    time: String,
    name: String,
    id: String,
}
struct Content {}

trait FeatureFSConfigTrait {
    fn features_path(&self) -> String;
    fn feature_name(&self) -> Result<String, String>;
}
struct FeatureFSConfig {}

impl FeatureFSConfigTrait for FeatureFSConfig {
    fn features_path(&self) -> String {
        // TODO: get the path from the platform
        env!("CARGO_MANIFEST_DIR").to_string() + "/TestFeatures/"
    }

    fn feature_name(&self) -> Result<String, String> {
        // TODO: get the feature name from the platform
        Ok("Test".to_string())
    }
}

// Feature File System is exposed to the feature
// Platform File System is what the Feature File System uses under the hood.
// Different platforms can have different file systems
// Different features have the same file system

// Doc
// fn metadata(resource_url: ResourceUrl) -> Result<Metadata, String>;
// if you read a directory it will give you back the files and folders inside of it.
// if you read a file, it will give you back the contents of that file (as a string?)
// what will the return type be?
// fn read(resource_url: ResourceUrl) -> Result<Content, String>;
// removing files or directories is not different from each other.
// fn remove(resource_url: ResourceUrl) -> Result<(), String>;
// import will decide if it needs to unzip a file. The contents of the url will be extracted and inserted into a database.
// fn import(url: String, dest_resource_url: Option<ResourceUrl>) -> Result<ResourceUrl, String>;

fn id_from_resource_url(resource_url: ResourceUrl) -> Result<ResourceId, String> {
    let url = Url::parse(&resource_url).map_err(|err| err.to_string())?;
    if url.scheme() != "polypod" {
        return Err("Not a polypod resource id".to_string());
    }
    url.last_segment()
}

fn id_from_fs_url(fs_url: String) -> Result<ResourceId, String> {
    let url = Url::parse(&fs_url).map_err(|err| err.to_string())?;
    url.last_segment()
}

fn resource_url_from_id(id: ResourceId) -> ResourceUrl {
    return "polypod://FeatureFiles/".to_string() + &id;
}

fn fs_url_from_id(id: ResourceId, config: &impl FeatureFSConfigTrait) -> Result<String, String> {
    feature_files_path(config).and_then(|path| Ok(path + "/" + &id))
}

#[allow(dead_code)]
fn fs_url_from_resource_url(
    resource_url: ResourceUrl,
    config: &impl FeatureFSConfigTrait,
) -> Result<String, String> {
    let id = id_from_resource_url(resource_url)?;
    return fs_url_from_id(id, config);
}

#[allow(dead_code)]
fn resource_url_from_fs_url(fs_url: String) -> Result<String, String> {
    let id = id_from_fs_url(fs_url)?;
    return Ok(resource_url_from_id(id));
}

fn feature_files_path(config: &impl FeatureFSConfigTrait) -> Result<String, String> {
    config
        .feature_name()
        .and_then(|name| Ok(config.features_path() + "/" + &name))
}

fn make_sure_feature_files_dir_exists(
    platform_fs: &impl PlatformFileSystemTrait,
    config: &impl FeatureFSConfigTrait,
) -> Result<(), String> {
    let files_path = feature_files_path(config)?;
    if platform_fs.exists(&files_path) {
        platform_fs.create_dir_structure(&files_path)?;
    }
    Ok(())
}

fn import(
    url: String,
    dest_resource_url: Option<ResourceUrl>,
    platform_fs: &impl PlatformFileSystemTrait,
    config: &impl FeatureFSConfigTrait,
) -> Result<ResourceUrl, String> {
    make_sure_feature_files_dir_exists(platform_fs, config)?;

    let id = match dest_resource_url {
        Some(res_id) => id_from_resource_url(res_id),
        None => Ok(Uuid::new_v4().to_string()),
    }?;

    let fs_url = fs_url_from_id(id.to_string(), config)?;

    platform_fs.unzip(&url, &fs_url)?;

    let resource_url = resource_url_from_id(id.to_string());
    return Ok(resource_url);
}

fn metadata(resource_url: ResourceUrl) -> Result<Metadata, String> {
    Ok(Metadata {
        is_directory: true,
        size: "".to_string(),
        time: "".to_string(),
        name: "".to_string(),
        id: "".to_string(),
    })
}
fn read(resource_url: ResourceUrl) -> Result<Content, String> {
    Err("mda".to_string())
}
fn remove(resource_url: ResourceUrl) -> Result<(), String> {
    Err("mda".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    use tempdir::TempDir;

    struct MockFSConfig {
        dir: TempDir,
    }

    impl MockFSConfig {
        fn new() -> Self {
            Self {
                dir: TempDir::new("my_directory_prefix").unwrap(),
            }
        }
    }

    impl FeatureFSConfigTrait for MockFSConfig {
        fn features_path(&self) -> String {
            // Here use the temp dir.
            // The temp dir will be automatically deleted when the reference to dir is dropped
            let a = self
                .dir
                .path()
                .to_path_buf()
                .into_os_string()
                .into_string()
                .unwrap();
            return a;
        }

        fn feature_name(&self) -> Result<String, String> {
            Ok("Test".to_string())
        }
    }

    #[test]
    fn test_id_from_resource_url_valid() {
        let id = "8970r10972490710497291".to_string();
        let res_id = "polypod://FeatureFiles/".to_string() + &id;
        let result = id_from_resource_url(res_id);
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), id);
    }

    #[test]
    fn test_id_from_resource_url_invalid_scheme() {
        let res_id = "hello://FeatureFiles/".to_string();
        let result = id_from_resource_url(res_id);
        assert!(result.is_err());
    }

    #[test]
    fn test_id_from_resource_url_invalid_path() {
        let res_id = "hello://".to_string();
        let result = id_from_resource_url(res_id);
        assert!(result.is_err());
    }

    #[test]
    fn test_fs_url_from_resource_url() {
        let config = MockFSConfig::new();

        let id = "8970r10972490710497291".to_string();
        let res_id = "polypod://FeatureFiles/".to_string() + &id;
        let result = fs_url_from_resource_url(res_id, &config);
        assert!(result.is_ok());

        let fs_url = fs_url_from_id(id, &config).unwrap();
        assert_eq!(result.unwrap(), fs_url);
    }

    #[test]
    fn test_resource_url_from_fs_url() {
        let id = "8970r10972490710497291".to_string();
        let fs_url = "file://Something/FeatureFiles/Test/".to_string() + &id;
        let result = resource_url_from_fs_url(fs_url);
        assert!(result.is_ok());

        let resource_url = resource_url_from_id(id);
        assert_eq!(result.unwrap(), resource_url);
    }

    #[test]
    fn test_import_creates_features_dir() {
        let config = MockFSConfig::new();
        let fs = PlatformFileSystem {};

        let url = env!("CARGO_MANIFEST_DIR").to_string() + "/src/test_files/test.zip";
        let result = import(url, None, &fs, &config);
        assert!(result.is_ok());
        assert_eq!(
            Path::new(&feature_files_path(&config).unwrap()).exists(),
            true
        );
    }

    #[test]
    fn test_import_unzips_successfully() {
        let config = MockFSConfig::new();
        let fs = PlatformFileSystem {};

        let url = env!("CARGO_MANIFEST_DIR").to_string() + "/src/test_files/test.zip";
        let result = import(url, None, &fs, &config);
        assert!(result.is_ok());

        let file_path = fs_url_from_resource_url(result.unwrap(), &config).unwrap() + "/test";
        assert_eq!(Path::new(&file_path).exists(), true);
    }
}

trait UrlUtils {
    fn last_segment(&self) -> Result<String, String>;
}

impl UrlUtils for Url {
    fn last_segment(&self) -> Result<String, String> {
        self.path_segments()
            .map(|c| c.collect::<Vec<_>>())
            .and_then(|segments| segments.last().cloned())
            .map(|id| id.to_string())
            .ok_or("Could not extract fs id from resource id. No path components".to_string())
    }
}
