use std::fs::{DirBuilder, File};
use std::path::Path;
use url::Url;
use uuid::Uuid;
use zip::ZipArchive;

trait PlatformFileSystemTrait: Sized {
    fn create_dir_structure(&self, path: &str) -> Result<(), String>;
    fn exists(&self, path: &str) -> bool;
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

// Feature File System is exposed to the feature
// Platform File System is what the Feature File System uses under the hood.
// Different platforms can have different file systems
// Different features have the same file system.

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

fn fs_url_from_id(id: ResourceId, feature_name: String) -> String {
    return feature_files_path(&feature_name) + "/" + &id;
}

#[allow(dead_code)]
fn fs_url_from_resource_url(
    resource_url: ResourceUrl,
    feature_name: String,
) -> Result<String, String> {
    let id = id_from_resource_url(resource_url)?;
    return Ok(fs_url_from_id(id, feature_name));
}

#[allow(dead_code)]
fn resource_url_from_fs_url(fs_url: String) -> Result<String, String> {
    let id = id_from_fs_url(fs_url)?;
    return Ok(resource_url_from_id(id));
}

fn features_path() -> String {
    // TODO: Create a path that will work on iOS, Android and Web
    env!("CARGO_MANIFEST_DIR").to_string() + "/TestFeatures/"
}

fn feature_files_path(feature_name: &str) -> String {
    let path = features_path() + feature_name;
    return path;
}

fn make_sure_feature_files_dir_exists(
    feature_name: &str,
    platform_fs: impl PlatformFileSystemTrait,
) -> Result<(), String> {
    let files_path = feature_files_path(feature_name);
    if platform_fs.exists(&files_path) {
        platform_fs.create_dir_structure(&files_path)?;
    }
    Ok(())
}

fn feature_name() -> Result<String, String> {
    // TODO: Ask platform. Note: function also used by tests. We need to mock it.
    Ok("Test".to_string())
}

fn import(
    url: String,
    dest_resource_url: Option<ResourceUrl>,
    platform_fs: impl PlatformFileSystemTrait,
) -> Result<ResourceUrl, String> {
    let feature_name = feature_name()?;

    make_sure_feature_files_dir_exists(&feature_name, platform_fs)?;

    let id = match dest_resource_url {
        Some(res_id) => id_from_resource_url(res_id),
        None => Ok(Uuid::new_v4().to_string()),
    }?;

    let fs_url = fs_url_from_id(id.to_string(), feature_name.to_string());

    // Todo: Move unzip to FileSystem
    let file = File::open(Path::new(&url)).map_err(|err| err.to_string())?;
    let mut archive = ZipArchive::new(file).map_err(|err| err.to_string())?;
    archive
        .extract(Path::new(&fs_url))
        .map_err(|err| err.to_string())?;

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

//TODO: Fix flaky tests. Use temp dir to write stuff to.
#[cfg(test)]
mod tests {
    use super::*;

    use tempdir::TempDir;

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
        let id = "8970r10972490710497291".to_string();
        let res_id = "polypod://FeatureFiles/".to_string() + &id;
        let result = fs_url_from_resource_url(res_id, feature_name().unwrap());
        assert!(result.is_ok());

        let fs_url = fs_url_from_id(id, feature_name().unwrap());
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
        let url = env!("CARGO_MANIFEST_DIR").to_string() + "/src/test_files/test.zip";
        let result = import(url, None, PlatformFileSystem {});
        assert!(result.is_ok());
        assert_eq!(
            Path::new(&feature_files_path(&feature_name().unwrap())).exists(),
            true
        );
        std::fs::remove_dir_all(Path::new(&features_path())).unwrap();
    }

    #[test]
    fn test_import_unzips_successfully() {
        let url = env!("CARGO_MANIFEST_DIR").to_string() + "/src/test_files/test.zip";
        let result = import(url, None, PlatformFileSystem {});
        assert!(result.is_ok());

        let file_path =
            fs_url_from_resource_url(result.unwrap(), feature_name().unwrap()).unwrap() + "/test";
        assert_eq!(Path::new(&file_path).exists(), true);

        std::fs::remove_dir_all(Path::new(&features_path())).unwrap();
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
