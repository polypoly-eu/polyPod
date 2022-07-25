use std::fs::{self, DirBuilder, File};
use std::path::Path;
use url::Url;
use uuid::Uuid;
use zip::ZipArchive;

// Feature File System is exposed to the feature
// Platform File System is what the Feature File System uses under the hood.
// Different platforms can have different file systems
// Different features have the same file system

trait PlatformFileSystemTrait: Sized {
    fn create_dir_structure(&self, path: &str) -> Result<(), String>;
    fn exists(&self, path: &str) -> bool;
    fn unzip(&self, from_url: &str, to_url: &str) -> Result<(), String>;
    fn is_directory(&self, url: &str) -> bool;
    fn size(&self, url: &str) -> Result<String, String>;
    fn time_modified(&self, url: &str) -> Result<String, String>;
    fn remove(&self, url: &str) -> Result<(), String>;
    fn dir_children(&self, dir_url: &str) -> Result<Vec<String>, String>;
    fn file_content(&self, file_url: &str) -> Result<Vec<u8>, String>;
    fn name(&self, path: &str) -> Result<String, String>;
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
        let from_url_path = Url::parse(from_url)
            .map_err(|err| err.to_string())?
            .path()
            .to_string();

        let file = File::open(Path::new(&from_url_path)).map_err(|err| err.to_string())?;
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

    fn remove(&self, url: &str) -> Result<(), String> {
        let path = Path::new(url);
        if path.is_dir() {
            fs::remove_dir_all(path).map_err(|err| err.to_string())?;
        } else {
            fs::remove_file(path).map_err(|err| err.to_string())?;
        }
        Ok(())
    }

    fn dir_children(&self, dir_url: &str) -> Result<Vec<String>, String> {
        let path = Path::new(dir_url);
        let contents = fs::read_dir(path).map_err(|err| err.to_string())?;
        let names: Vec<String> = contents
            .filter_map(|c| c.ok())
            .filter_map(|c| c.file_name().into_string().ok())
            .collect();
        Ok(names)
    }

    fn file_content(&self, file_url: &str) -> Result<Vec<u8>, String> {
        let path = Path::new(&file_url);
        fs::read(path).map_err(|err| err.to_string())
    }

    fn name(&self, path: &str) -> Result<String, String> {
        let p = Path::new(&path);
        p.file_name()
            .ok_or("Could not get filename from path".to_string())?
            .to_owned()
            .into_string()
            .map_err(|err| err.into_string().unwrap_or_default())
    }
}

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

fn feature_files_path(config: &impl FeatureFSConfigTrait) -> Result<String, String> {
    let features_path = config.features_path()?;
    let feature_name = config.feature_name()?;
    Ok("file://".to_string() + &features_path + "/" + &feature_name)
}

type ResourceUrl = String;
type ResourceId = String;

fn resource_url_from_id(id: &ResourceId) -> ResourceUrl {
    let res_prefix = "polypod://FeatureFiles".to_string();
    return res_prefix + "/" + &id;
}

fn fs_url_from_id(id: &ResourceId, config: &impl FeatureFSConfigTrait) -> Result<String, String> {
    let fs_prefix = feature_files_path(config)?;
    Ok(fs_prefix + "/" + &id)
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
    url: &Url,
    dest_resource_url: Option<ResourceUrl>,
    platform_fs: &impl PlatformFileSystemTrait,
    config: &impl FeatureFSConfigTrait,
) -> Result<ResourceUrl, String> {
    make_sure_feature_files_dir_exists(platform_fs, config)?;

    let fs_url = match dest_resource_url {
        Some(res_url) => fs_url_from_resource_url(&res_url, config),
        None => fs_url_from_id(&Uuid::new_v4().to_string(), config),
    }?;

    platform_fs.unzip(&url.as_str(), &fs_url)?;

    resource_url_from_fs_url(&fs_url, config)
}

struct Metadata {
    is_directory: bool,
    size: String,
    time: String,
    name: String,
    id: String,
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
    let name = platform_fs.name(&fs_url)?;
    Ok(Metadata {
        is_directory: is_dir,
        size,
        time: time_mod,
        name,
        id: fs_url,
    })
}

fn read_dir(
    resource_url: &ResourceUrl,
    platform_fs: &impl PlatformFileSystemTrait,
    config: &impl FeatureFSConfigTrait,
) -> Result<Vec<String>, String> {
    let fs_url = fs_url_from_resource_url(resource_url, config)?;
    if platform_fs.is_directory(&fs_url) {
        return platform_fs.dir_children(&fs_url);
    } else {
        return Err("resource url is not pointing to a directory.".to_string());
    }
}

fn read_file(
    resource_url: &ResourceUrl,
    platform_fs: &impl PlatformFileSystemTrait,
    config: &impl FeatureFSConfigTrait,
) -> Result<Vec<u8>, String> {
    let fs_url = fs_url_from_resource_url(resource_url, config)?;
    if !platform_fs.is_directory(&fs_url) {
        return platform_fs.file_content(&fs_url);
    } else {
        return Err("resource url is not pointing to a file".to_string());
    }
}

fn remove(
    resource_url: &ResourceUrl,
    platform_fs: &impl PlatformFileSystemTrait,
    config: &impl FeatureFSConfigTrait,
) -> Result<(), String> {
    let fs_url = fs_url_from_resource_url(resource_url, config)?;
    platform_fs.remove(&fs_url)
}

#[cfg(test)]
mod tests {
    use std::io::Write;

    use super::*;

    use tempfile::TempDir;

    fn zip_file_url() -> Url {
        Url::parse(
            &("file://".to_string()
                + &env!("CARGO_MANIFEST_DIR").to_string()
                + "/src/test_files/test.zip"),
        )
        .unwrap()
    }

    fn id() -> String {
        "8970r10972490710497291".to_string()
    }

    fn create_temp_fs_dir(
        name: &String,
        fs: &impl PlatformFileSystemTrait,
        config: &impl FeatureFSConfigTrait,
    ) -> String {
        // Temp dir because of test config
        let fs_url = fs_url_from_id(name, config).unwrap();
        fs.create_dir_structure(&fs_url).unwrap();
        return fs_url;
    }

    fn create_file_in_fs_dir(dir_path: &str, file_name: &str, file_content: &[u8]) -> String {
        let file_url = dir_path.to_string() + "/" + file_name;
        let file_path = Path::new(&file_url);
        let mut file = match File::create(file_path) {
            Err(why) => panic!("couldn't create: {}", why),
            Ok(file) => file,
        };
        file.write_all(file_content).unwrap();
        file.sync_all().unwrap();
        return file_url;
    }

    fn create_dir_in_fs_dir(dir_path: &str, dir_name: &str) -> String {
        let full_path = dir_path.to_string() + "/" + dir_name;
        let path = Path::new(&full_path);
        DirBuilder::new().recursive(true).create(path).unwrap();
        return full_path;
    }

    struct MockFSConfig {
        dir: TempDir,
    }

    impl MockFSConfig {
        // Todo: Clear temp dir.
        fn new() -> Self {
            Self {
                dir: TempDir::new().unwrap(),
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

        let url = zip_file_url();
        let result = import(&url, None, &fs, &config);
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

        let url = zip_file_url();
        let result = import(&url, None, &fs, &config);
        assert!(result.is_ok());

        let file_path = fs_url_from_resource_url(&result.unwrap(), &config).unwrap() + "/test";
        assert_eq!(Path::new(&file_path).exists(), true);
    }

    #[test]
    fn test_metadata_file() {
        let config = MockFSConfig::new();
        let fs = PlatformFileSystem {};

        let dir_name = id();
        let file_name = "test.zip".to_string();
        let fs_url = create_temp_fs_dir(&dir_name, &fs, &config);
        create_file_in_fs_dir(&fs_url, &file_name, b"Hello, world!");

        let resource_url = resource_url_from_id(&dir_name) + "/" + &file_name;
        let result = metadata(&resource_url, &fs, &config);
        assert!(result.is_ok());

        let metadata = result.unwrap();
        assert_eq!(
            metadata.id,
            fs_url_from_resource_url(&resource_url, &config).unwrap()
        );
        assert_eq!(metadata.name, file_name);
        assert_eq!(metadata.is_directory, false);
        assert_ne!(metadata.time, "");
        assert_ne!(metadata.size, "");
        assert_ne!(metadata.size, "0");
    }

    #[test]
    fn test_metadata_dir() {
        let config = MockFSConfig::new();
        let fs = PlatformFileSystem {};

        let dir_name = id();
        let file_name = "test.zip".to_string();
        let fs_url = create_temp_fs_dir(&dir_name, &fs, &config);
        create_file_in_fs_dir(&fs_url, &file_name, b"Hello, world!");

        let resource_url = resource_url_from_id(&dir_name);
        let result = metadata(&resource_url, &fs, &config);
        assert!(result.is_ok());

        let metadata = result.unwrap();
        assert_eq!(
            metadata.id,
            fs_url_from_resource_url(&resource_url, &config).unwrap()
        );
        assert_eq!(metadata.name, dir_name);
        assert_eq!(metadata.is_directory, true);
        assert_ne!(metadata.time, "");
        assert_ne!(metadata.size, "");
        assert_ne!(metadata.size, "0");
    }

    #[test]
    fn test_remove_dir() {
        let config = MockFSConfig::new();
        let fs = PlatformFileSystem {};

        let dir_name = id();
        let file_name = "test.zip".to_string();
        let fs_url = create_temp_fs_dir(&dir_name, &fs, &config);
        create_file_in_fs_dir(&fs_url, &file_name, b"Hello, world!");

        assert_eq!(Path::new(&fs_url).exists(), true);

        let resource_url = resource_url_from_id(&dir_name);
        let result = remove(&resource_url, &fs, &config);
        assert!(result.is_ok());

        assert_eq!(Path::new(&fs_url).exists(), false);
    }

    #[test]
    fn test_remove_file() {
        let config = MockFSConfig::new();
        let fs = PlatformFileSystem {};

        let dir_name = id();
        let file_name = "test.zip".to_string();
        let fs_url = create_temp_fs_dir(&dir_name, &fs, &config);
        let file_url = create_file_in_fs_dir(&fs_url, &file_name, b"Hello, world!");

        assert_eq!(Path::new(&fs_url).exists(), true);
        assert_eq!(Path::new(&file_url).exists(), true);

        let resource_url = resource_url_from_id(&dir_name) + "/" + &file_name;
        let result = remove(&resource_url, &fs, &config);
        assert!(result.is_ok());

        assert_eq!(Path::new(&fs_url).exists(), true);
        assert_eq!(Path::new(&file_url).exists(), false);
    }

    #[test]
    fn test_read_dir_valid() {
        let config = MockFSConfig::new();
        let fs = PlatformFileSystem {};

        let id = id();
        let file_name = "test.zip".to_string();
        let dir_name = "test".to_string();
        let fs_url = create_temp_fs_dir(&id, &fs, &config);
        let file_url = create_file_in_fs_dir(&fs_url, &file_name, b"Hello, world!");
        let dir_url = create_dir_in_fs_dir(&fs_url, &dir_name);

        assert_eq!(Path::new(&fs_url).exists(), true);
        assert_eq!(Path::new(&file_url).exists(), true);
        assert_eq!(Path::new(&dir_url).exists(), true);

        let resource_url = resource_url_from_id(&id);
        let result = read_dir(&resource_url, &fs, &config);
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), vec!["test", "test.zip"]);
    }

    #[test]
    fn test_read_dir_invalid() {
        let config = MockFSConfig::new();
        let fs = PlatformFileSystem {};

        let id = id();
        let file_name = "test.zip".to_string();
        let fs_url = create_temp_fs_dir(&id, &fs, &config);
        let file_url = create_file_in_fs_dir(&fs_url, &file_name, b"Hello, world!");

        assert_eq!(Path::new(&fs_url).exists(), true);
        assert_eq!(Path::new(&file_url).exists(), true);

        let resource_url = resource_url_from_fs_url(&file_url, &config).unwrap();
        let result = read_dir(&resource_url, &fs, &config);
        assert!(result.is_err());
    }

    #[test]
    fn test_read_file_valid() {
        let config = MockFSConfig::new();
        let fs = PlatformFileSystem {};

        let id = id();
        let file_name = "test.zip".to_string();
        let fs_url = create_temp_fs_dir(&id, &fs, &config);
        let file_url = create_file_in_fs_dir(&fs_url, &file_name, b"Hello, world!");

        assert_eq!(Path::new(&fs_url).exists(), true);
        assert_eq!(Path::new(&file_url).exists(), true);

        let resource_url = resource_url_from_fs_url(&file_url, &config).unwrap();
        let result = read_file(&resource_url, &fs, &config);
        assert!(result.is_ok());
        assert!(result.unwrap().len() > 0);
    }

    #[test]
    fn test_read_file_invalid() {
        let config = MockFSConfig::new();
        let fs = PlatformFileSystem {};

        let id = id();
        let fs_url = create_temp_fs_dir(&id, &fs, &config);

        assert_eq!(Path::new(&fs_url).exists(), true);

        let resource_url = resource_url_from_fs_url(&fs_url, &config).unwrap();
        let result = read_file(&resource_url, &fs, &config);
        assert!(result.is_err());
    }
}

//TODO: Fix temp dir issue where it remains on disk after the tests are run

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
