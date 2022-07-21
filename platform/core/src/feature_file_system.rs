use lazy_static::lazy_static;
use regex::Regex;
use std::fs::{DirBuilder, File};
use std::path::Path;
use url::Url;
use uuid::Uuid;
use zip::ZipArchive;

trait PlatformFileSystemTrait: Sized {
    fn create_dir_structure(&self, path: &str) -> Result<(), String>;
    fn exists(&self, path: &str) -> bool;
    fn unzip(&self, from_url: &str, to_url: &str) -> Result<(), String>;
    fn is_directory(&self, url: &str) -> bool;
    fn size(&self, url: &str) -> Result<String, String>;
    fn time_modified(&self, url: &str) -> Result<String, String>;
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

    fn is_directory(&self, url: &str) -> bool {
        let path = Path::new(url);
        path.is_dir()
    }

    fn size(&self, url: &str) -> Result<String, String> {
        let path = Path::new(url);
        let metadata = path.metadata().map_err(|err| err.to_string())?;
        Ok(metadata.len().to_string())
    }

    fn time_modified(&self, url: &str) -> Result<String, String> {
        let path = Path::new(url);
        let metadata = path.metadata().map_err(|err| err.to_string())?;
        let time = metadata
            .modified()
            .map_err(|err| err.to_string())?
            .duration_since(std::time::SystemTime::UNIX_EPOCH)
            .map_err(|err| err.to_string())?
            .as_secs()
            .to_string();
        Ok(time)
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
    fn features_path(&self) -> Result<String, String>;
    fn feature_name(&self) -> Result<String, String>;
}
struct FeatureFSConfig {}

impl FeatureFSConfigTrait for FeatureFSConfig {
    fn features_path(&self) -> Result<String, String> {
        // TODO: get the path from the platform
        Ok(env!("CARGO_MANIFEST_DIR").to_string() + "/TestFeatures/")
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

fn feature_files_path(config: &impl FeatureFSConfigTrait) -> Result<String, String> {
    let features_path = config.features_path()?;
    let feature_name = config.feature_name()?;
    Ok("file://".to_string() + &features_path + "/" + &feature_name)
}

fn resource_url_from_id(id: &ResourceId) -> ResourceUrl {
    return "polypod://FeatureFiles/".to_string() + &id;
}

fn fs_url_from_id(id: &ResourceId, config: &impl FeatureFSConfigTrait) -> Result<String, String> {
    let feature_files_path = feature_files_path(config)?;
    Ok(feature_files_path + "/" + &id)
}

#[allow(dead_code)]
fn fs_url_from_resource_url(
    resource_url: &ResourceUrl,
    config: &impl FeatureFSConfigTrait,
) -> Result<String, String> {
    let fs_prefix = feature_files_path(config)?;
    let res_prefix = "polypod://FeatureFiles".to_string();
    swap_prefix(&resource_url, &res_prefix, &fs_prefix)
}

#[allow(dead_code)]
fn resource_url_from_fs_url(
    fs_url: &String,
    config: &impl FeatureFSConfigTrait,
) -> Result<String, String> {
    let fs_prefix = feature_files_path(config)?;
    let res_prefix = "polypod://FeatureFiles/".to_string();
    swap_prefix(&fs_url, &fs_prefix, &res_prefix)
}

fn swap_prefix(string: &str, from: &str, to: &str) -> Result<String, String> {
    if !string.starts_with(from) {
        return Err(format!("{} does not start with {}", string, from));
    }
    Ok(string.replace(&from, &to))
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
    url: &String,
    dest_resource_url: Option<ResourceUrl>,
    platform_fs: &impl PlatformFileSystemTrait,
    config: &impl FeatureFSConfigTrait,
) -> Result<ResourceUrl, String> {
    make_sure_feature_files_dir_exists(platform_fs, config)?;

    let fs_url = match dest_resource_url {
        Some(res_url) => fs_url_from_resource_url(&res_url, config),
        None => fs_url_from_id(&Uuid::new_v4().to_string(), config),
    }?;

    platform_fs.unzip(&url, &fs_url)?;

    resource_url_from_fs_url(&fs_url, config)
}

fn metadata(
    resource_url: &ResourceUrl,
    platform_fs: &impl PlatformFileSystemTrait,
    config: &impl FeatureFSConfigTrait,
) -> Result<Metadata, String> {
    let fs_url = fs_url_from_resource_url(resource_url, config)?;
    let is_dir = platform_fs.is_directory(&fs_url);
    let size = platform_fs.size(&fs_url)?;
    let time_mod = platform_fs.time_modified(&fs_url)?;
    let name = Url::parse(&fs_url)
        .map_err(|err| err.to_string())?
        .last_segment()?;

    Ok(Metadata {
        is_directory: is_dir,
        size: size,
        time: time_mod,
        name: name,
        id: fs_url,
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

    fn zip_file_path() -> String {
        env!("CARGO_MANIFEST_DIR").to_string() + "/src/test_files/test.zip"
    }

    fn zip_file_url() -> String {
        "file://".to_string() + &env!("CARGO_MANIFEST_DIR").to_string() + "/src/test_files/test.zip"
    }

    fn id() -> String {
        "8970r10972490710497291".to_string()
    }

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
        fn features_path(&self) -> Result<String, String> {
            // Here use the temp dir.
            // The temp dir will be automatically deleted when the reference to dir is dropped
            self.dir
                .path()
                .to_path_buf()
                .into_os_string()
                .into_string()
                .map_err(|err| err.into_string().unwrap())
        }

        fn feature_name(&self) -> Result<String, String> {
            Ok("Test".to_string())
        }
    }

    #[test]
    fn test_fs_url_from_resource_url() {
        let config = MockFSConfig::new();

        let id = id();
        let res_id = "polypod://FeatureFiles/".to_string() + &id;
        let result = fs_url_from_resource_url(&res_id, &config);
        assert!(result.is_ok());

        let fs_url = feature_files_path(&config).unwrap() + "/" + &id;
        assert_eq!(result.unwrap(), fs_url);
    }

    #[test]
    fn test_resource_url_from_fs_url() {
        let config = MockFSConfig::new();
        let id = id();
        let fs_url = feature_files_path(&config).unwrap() + &id;
        let result = resource_url_from_fs_url(&fs_url, &config);
        assert!(result.is_ok());

        let resource_url = resource_url_from_id(&id);
        assert_eq!(result.unwrap(), resource_url);
    }

    #[test]
    fn test_import_creates_features_dir() {
        let config = MockFSConfig::new();
        let fs = PlatformFileSystem {};

        let path = zip_file_path();
        let result = import(&path, None, &fs, &config);
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

        let path = zip_file_path();
        let result = import(&path, None, &fs, &config);
        assert!(result.is_ok());

        let file_path = fs_url_from_resource_url(&result.unwrap(), &config).unwrap() + "/test";
        assert_eq!(Path::new(&file_path).exists(), true);
    }

    // #[test]
    // fn test_metadata_zip_file() {
    //     let config = MockFSConfig::new();
    //     let fs = PlatformFileSystem {};

    //     // Create the resource with a certain id on the FS.
    //     let id = id_test();
    //     let fs_url = fs_url_from_id(&id, &config).unwrap();
    //     fs.create_dir_structure(&fs_url).unwrap();
    //     // Create zip file at fs_url
    //     let file_url = fs_url.to_string() + "/" + "test.zip";
    //     let file_path = Path::new(&file_url);
    //     match File::create(file_path) {
    //         Err(why) => panic!("couldn't create: {}", why),
    //         Ok(file) => file,
    //     };

    //     let resource_url = resource_url_from_id(&id) + "/test.zip";
    //     let result = metadata(&resource_url, &fs, &config);
    //     assert!(result.is_ok());

    //     let metadata = result.unwrap();
    //     assert_eq!(
    //         metadata.id,
    //         fs_url_from_resource_url(&resource_url, &config).unwrap()
    //     );
    // }

    // #[test]
    // fn test_metadata_dir() {
    //     let config = MockFSConfig::new();
    //     let fs = PlatformFileSystem {};

    //     // Create the resource with a certain id on the FS.
    //     let id = id_test();
    //     let fs_url = fs_url_from_id(&id, &config).unwrap();
    //     fs.create_dir_structure(&fs_url).unwrap();
    //     // Create zip file at fs_url
    //     let file_url = fs_url.to_string() + "/" + "test.zip";
    //     let file_path = Path::new(&file_url);
    //     match File::create(file_path) {
    //         Err(why) => panic!("couldn't create: {}", why),
    //         Ok(file) => file,
    //     };

    //     let resource_url = resource_url_from_id(&id) + "/test.zip";
    //     let result = metadata(&resource_url, &fs, &config);
    //     assert!(result.is_ok());

    //     let metadata = result.unwrap();
    //     assert_eq!(
    //         metadata.id,
    //         fs_url_from_resource_url(&resource_url, &config).unwrap()
    //     );
    // }
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
