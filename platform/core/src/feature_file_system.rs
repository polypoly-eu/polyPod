use crate::{core_failure::CoreFailure, io::file_system::FileSystem};
use url::Url;
use uuid::Uuid;

type ResourceUrl = String;
#[allow(dead_code)]
type ResourceId = String;

#[allow(dead_code)]
fn resource_url_from_id(id: &ResourceId) -> ResourceUrl {
    let res_prefix = "polypod://FeatureFiles/".to_string();
    res_prefix + id
}

#[allow(dead_code)]
fn fs_path_from_id(id: &ResourceId, feature_folder_path: &str) -> Result<String, CoreFailure> {
    let fs_path = add_slash_at_end_if_necessary(feature_folder_path);
    Ok(fs_path + id)
}

#[allow(dead_code)]
fn fs_path_from_resource_url(
    resource_url: &ResourceUrl,
    feature_folder_path: &str,
) -> Result<String, CoreFailure> {
    let fs_prefix = add_slash_at_end_if_necessary(feature_folder_path);
    let res_prefix = "polypod://FeatureFiles/".to_string();
    swap_prefix(resource_url, &res_prefix, &fs_prefix).map_err(|err| {
        CoreFailure::failed_to_convert_to_fs_path_from_resource_url(resource_url.to_string(), err)
    })
}

#[allow(dead_code)]
fn resource_url_from_fs_path(
    fs_path: &str,
    feature_folder_path: &str,
) -> Result<String, CoreFailure> {
    let fs_prefix = add_slash_at_end_if_necessary(feature_folder_path);
    let res_prefix = "polypod://FeatureFiles/".to_string();
    swap_prefix(fs_path, &fs_prefix, &res_prefix).map_err(|err| {
        CoreFailure::failed_to_convert_to_resource_url_from_fs_path(fs_path.to_string(), err)
    })
}

fn swap_prefix(string: &str, from: &str, to: &str) -> Result<String, String> {
    if !string.starts_with(from) {
        return Err(format!("{} does not start with {}", string, from));
    }
    Ok(string.replace(from, to))
}

fn add_slash_at_end_if_necessary(string: &str) -> String {
    if !string.chars().last().unwrap_or_default().eq(&'/') {
        string.to_string() + "/"
    } else {
        string.to_string()
    }
}

#[allow(dead_code)]
fn make_sure_feature_files_dir_exists(
    platform_fs: &impl FileSystem,
    feature_folder_path: &str,
) -> Result<(), CoreFailure> {
    let fs_path = add_slash_at_end_if_necessary(feature_folder_path);
    if platform_fs.exists(&fs_path) {
        platform_fs.create_dir_structure(&fs_path)?;
    }
    Ok(())
}

// if no dest_resource_url is provided, it creates one and returns it.
#[allow(dead_code)]
fn import_archive(
    url: &Url,
    dest_resource_url: Option<ResourceUrl>,
    platform_fs: &impl FileSystem,
    feature_folder_path: &str,
) -> Result<ResourceUrl, CoreFailure> {
    make_sure_feature_files_dir_exists(platform_fs, feature_folder_path)?;

    let fs_path = match dest_resource_url {
        Some(res_url) => fs_path_from_resource_url(&res_url, feature_folder_path),
        None => fs_path_from_id(&Uuid::new_v4().to_string(), feature_folder_path),
    }?;

    platform_fs.unzip(url.as_str(), &fs_path)?;

    resource_url_from_fs_path(&fs_path, feature_folder_path)
}

// if no dest_resource_url is provided, it creates one and returns it.
// it returns the path of the folder in which the file was written
#[allow(dead_code)]
fn write_file(
    url: &Url,
    dest_resource_url: Option<ResourceUrl>,
    platform_fs: &impl FileSystem,
    feature_folder_path: &str,
) -> Result<ResourceUrl, CoreFailure> {
    make_sure_feature_files_dir_exists(platform_fs, feature_folder_path)?;

    let dir_path = match dest_resource_url {
        Some(res_url) => fs_path_from_resource_url(&res_url, feature_folder_path),
        None => fs_path_from_id(&Uuid::new_v4().to_string(), feature_folder_path),
    }?;

    // get contents from that url. Should I use fetch? Should this be platform specific?
    // assume a file url for now
    let url_path = url
        .to_file_path()
        .map_err(|()| CoreFailure::failed_to_get_file_path(url.to_owned(), "".to_string()))?
        .to_str()
        .unwrap_or_default()
        .to_owned();

    let file_name = url
        .last_segment()
        .map_err(|err| CoreFailure::failed_to_get_last_segment_from_url(url.to_owned(), err))?;

    let file_path = dir_path + "/" + &file_name;

    platform_fs.copy(&url_path, &file_path)?;

    resource_url_from_fs_path(&file_path, feature_folder_path)
}

#[allow(dead_code)]
struct Metadata {
    is_directory: bool,
    size: String,
    time: String,
    name: String,
    id: String,
}

#[allow(dead_code)]
fn metadata(
    resource_url: &ResourceUrl,
    platform_fs: &impl FileSystem,
    feature_folder_path: &str,
) -> Result<Metadata, CoreFailure> {
    let fs_path = fs_path_from_resource_url(resource_url, feature_folder_path)?;
    let is_dir = platform_fs.is_directory(&fs_path);
    let size = platform_fs.size(&fs_path)?;
    let time_mod = platform_fs.time_modified(&fs_path)?;
    let name = platform_fs.name(&fs_path)?;
    Ok(Metadata {
        is_directory: is_dir,
        size,
        time: time_mod,
        name,
        id: fs_path,
    })
}

#[allow(dead_code)]
fn read_dir(
    resource_url: &ResourceUrl,
    platform_fs: &impl FileSystem,
    feature_folder_path: &str,
) -> Result<Vec<String>, CoreFailure> {
    let fs_path = fs_path_from_resource_url(resource_url, feature_folder_path)?;
    if platform_fs.is_directory(&fs_path) {
        platform_fs.dir_children(&fs_path)
    } else {
        Err(CoreFailure::failed_file_system_operation(
            resource_url.to_string(),
            "resource url is not pointing to a directory.".to_string(),
        ))
    }
}

#[allow(dead_code)]
fn read_file(
    resource_url: &ResourceUrl,
    platform_fs: &impl FileSystem,
    feature_folder_path: &str,
) -> Result<Vec<u8>, CoreFailure> {
    let fs_path = fs_path_from_resource_url(resource_url, feature_folder_path)?;
    if !platform_fs.is_directory(&fs_path) {
        platform_fs.file_content(&fs_path)
    } else {
        Err(CoreFailure::failed_file_system_operation(
            resource_url.to_string(),
            "resource url is not pointing to a file".to_string(),
        ))
    }
}

#[allow(dead_code)]
fn remove(
    resource_url: &ResourceUrl,
    platform_fs: &impl FileSystem,
    feature_folder_path: &str,
) -> Result<(), CoreFailure> {
    let fs_path = fs_path_from_resource_url(resource_url, feature_folder_path)?;
    platform_fs.remove(&fs_path)
}

#[cfg(test)]
mod tests {
    use std::io::Write;

    use super::*;

    use crate::io::file_system::DefaultFileSystem;
    use std::collections::HashSet;
    use std::fs::{DirBuilder, File};
    use std::iter::FromIterator;
    use std::path::Path;
    use tempfile::TempDir;
    use url::Url;

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
        fs: &impl FileSystem,
        feature_folder_path: &str,
    ) -> String {
        // Temp dir because of test config
        let fs_path = fs_path_from_id(name, feature_folder_path).unwrap();
        fs.create_dir_structure(&fs_path).unwrap();
        return fs_path;
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
        #[allow(dead_code)]
        dir: TempDir,
        features_folder_path: String,
    }

    impl MockFSConfig {
        fn new() -> Self {
            let temp = TempDir::new().unwrap();
            let feature_folder_path = temp
                .path()
                .to_path_buf()
                .into_os_string()
                .into_string()
                .map_err(|err| err.into_string().unwrap())
                .unwrap()
                + "/"
                + "Test";
            Self {
                dir: temp,
                features_folder_path: feature_folder_path,
            }
        }
    }

    #[test]
    fn test_fs_path_from_resource_url() {
        let config = MockFSConfig::new();

        let id = id();
        let res_id = "polypod://FeatureFiles/".to_string() + &id;
        let result = fs_path_from_resource_url(&res_id, &config.features_folder_path);
        assert!(result.is_ok());

        let fs_path = config.features_folder_path.to_owned() + "/" + &id;
        assert_eq!(result.unwrap(), fs_path);

        let result_w_slash =
            fs_path_from_resource_url(&res_id, &(config.features_folder_path.to_owned() + "/"));

        assert!(result_w_slash.is_ok());
        assert_eq!(result_w_slash.unwrap(), fs_path);
    }

    #[test]
    fn test_resource_url_from_fs_path() {
        let config = MockFSConfig::new();
        let id = id();
        let fs_path = config.features_folder_path.to_owned() + "/" + &id;
        let result = resource_url_from_fs_path(&fs_path, &config.features_folder_path);
        assert!(result.is_ok());

        let resource_url = resource_url_from_id(&id);
        assert_eq!(result.unwrap(), resource_url);

        let result_w_slash =
            resource_url_from_fs_path(&fs_path, &(config.features_folder_path.to_owned() + "/"));
        assert!(result_w_slash.is_ok());
        assert_eq!(result_w_slash.unwrap(), resource_url);
    }

    #[test]
    fn test_import_creates_features_dir() {
        let config = MockFSConfig::new();
        let fs = DefaultFileSystem {};

        let url = zip_file_url();
        let result = import_archive(&url, None, &fs, &config.features_folder_path);
        assert!(result.is_ok());
        assert_eq!(Path::new(&config.features_folder_path).exists(), true);
    }

    #[test]
    fn test_import_unzips_successfully() {
        let config = MockFSConfig::new();
        let fs = DefaultFileSystem {};

        let url = zip_file_url();
        let result = import_archive(&url, None, &fs, &config.features_folder_path);
        assert!(result.is_ok());

        let file_path = fs_path_from_resource_url(&result.unwrap(), &config.features_folder_path)
            .unwrap()
            + "/test";
        assert_eq!(Path::new(&file_path).exists(), true);
    }

    #[test]
    fn test_metadata_file() {
        let config = MockFSConfig::new();
        let fs = DefaultFileSystem {};

        let dir_name = id();
        let file_name = "test.zip".to_string();
        let fs_path = create_temp_fs_dir(&dir_name, &fs, &config.features_folder_path);
        create_file_in_fs_dir(&fs_path, &file_name, b"Hello, world!");

        let resource_url = resource_url_from_id(&dir_name) + "/" + &file_name;
        let result = metadata(&resource_url, &fs, &config.features_folder_path);
        assert!(result.is_ok());

        let metadata = result.unwrap();
        assert_eq!(
            metadata.id,
            fs_path_from_resource_url(&resource_url, &config.features_folder_path).unwrap()
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
        let fs = DefaultFileSystem {};

        let dir_name = id();
        let file_name = "test.zip".to_string();
        let fs_path = create_temp_fs_dir(&dir_name, &fs, &config.features_folder_path);
        create_file_in_fs_dir(&fs_path, &file_name, b"Hello, world!");

        let resource_url = resource_url_from_id(&dir_name);
        let result = metadata(&resource_url, &fs, &config.features_folder_path);
        assert!(result.is_ok());

        let metadata = result.unwrap();
        assert_eq!(
            metadata.id,
            fs_path_from_resource_url(&resource_url, &config.features_folder_path).unwrap()
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
        let fs = DefaultFileSystem {};

        let dir_name = id();
        let file_name = "test.zip".to_string();
        let fs_path = create_temp_fs_dir(&dir_name, &fs, &config.features_folder_path);
        create_file_in_fs_dir(&fs_path, &file_name, b"Hello, world!");

        assert_eq!(Path::new(&fs_path).exists(), true);

        let resource_url = resource_url_from_id(&dir_name);
        let result = remove(&resource_url, &fs, &config.features_folder_path);
        assert!(result.is_ok());

        assert_eq!(Path::new(&fs_path).exists(), false);
    }

    #[test]
    fn test_remove_file() {
        let config = MockFSConfig::new();
        let fs = DefaultFileSystem {};

        let dir_name = id();
        let file_name = "test.zip".to_string();
        let fs_path = create_temp_fs_dir(&dir_name, &fs, &config.features_folder_path);
        let file_url = create_file_in_fs_dir(&fs_path, &file_name, b"Hello, world!");

        assert_eq!(Path::new(&fs_path).exists(), true);
        assert_eq!(Path::new(&file_url).exists(), true);

        let resource_url = resource_url_from_id(&dir_name) + "/" + &file_name;
        let result = remove(&resource_url, &fs, &config.features_folder_path);
        assert!(result.is_ok());

        assert_eq!(Path::new(&fs_path).exists(), true);
        assert_eq!(Path::new(&file_url).exists(), false);
    }

    #[test]
    fn test_read_dir_valid() {
        let config = MockFSConfig::new();
        let fs = DefaultFileSystem {};

        let id = id();
        let file_name = "test.zip".to_string();
        let dir_name = "test".to_string();
        let fs_path = create_temp_fs_dir(&id, &fs, &config.features_folder_path);
        let file_url = create_file_in_fs_dir(&fs_path, &file_name, b"Hello, world!");
        let dir_url = create_dir_in_fs_dir(&fs_path, &dir_name);

        assert_eq!(Path::new(&fs_path).exists(), true);
        assert_eq!(Path::new(&file_url).exists(), true);
        assert_eq!(Path::new(&dir_url).exists(), true);

        let resource_url = resource_url_from_id(&id);
        let result = read_dir(&resource_url, &fs, &config.features_folder_path);
        assert!(result.is_ok());

        assert_eq!(
            HashSet::from_iter(result.unwrap().iter().cloned()),
            HashSet::from(["test".to_string(), "test.zip".to_string()])
        );
    }

    #[test]
    fn test_read_dir_invalid() {
        let config = MockFSConfig::new();
        let fs = DefaultFileSystem {};

        let id = id();
        let file_name = "test.zip".to_string();
        let fs_path = create_temp_fs_dir(&id, &fs, &config.features_folder_path);
        let file_url = create_file_in_fs_dir(&fs_path, &file_name, b"Hello, world!");

        assert_eq!(Path::new(&fs_path).exists(), true);
        assert_eq!(Path::new(&file_url).exists(), true);

        let resource_url =
            resource_url_from_fs_path(&file_url, &config.features_folder_path).unwrap();
        let result = read_dir(&resource_url, &fs, &config.features_folder_path);
        assert!(result.is_err());
    }

    #[test]
    fn test_read_file_valid() {
        let config = MockFSConfig::new();
        let fs = DefaultFileSystem {};

        let id = id();
        let file_name = "test.zip".to_string();
        let fs_path = create_temp_fs_dir(&id, &fs, &config.features_folder_path);
        let file_url = create_file_in_fs_dir(&fs_path, &file_name, b"Hello, world!");

        assert_eq!(Path::new(&fs_path).exists(), true);
        assert_eq!(Path::new(&file_url).exists(), true);

        let resource_url =
            resource_url_from_fs_path(&file_url, &config.features_folder_path).unwrap();
        let result = read_file(&resource_url, &fs, &config.features_folder_path);
        assert!(result.is_ok());
        assert!(result.unwrap().len() > 0);
    }

    #[test]
    fn test_read_file_invalid() {
        let config = MockFSConfig::new();
        let fs = DefaultFileSystem {};

        let id = id();
        let fs_path = create_temp_fs_dir(&id, &fs, &config.features_folder_path);

        assert_eq!(Path::new(&fs_path).exists(), true);

        let resource_url =
            resource_url_from_fs_path(&fs_path, &config.features_folder_path).unwrap();
        let result = read_file(&resource_url, &fs, &config.features_folder_path);
        assert!(result.is_err());
    }

    #[test]
    fn test_write_file_valid() {
        let config = MockFSConfig::new();
        let fs = DefaultFileSystem {};

        let id = id();
        let fs_path = create_temp_fs_dir(&id, &fs, &config.features_folder_path);

        assert_eq!(Path::new(&fs_path).exists(), true);

        let url = zip_file_url();
        let file_name = url.last_segment().unwrap();
        let resource_url =
            resource_url_from_fs_path(&fs_path, &config.features_folder_path).unwrap();

        let result = write_file(&url, Some(resource_url), &fs, &config.features_folder_path);
        let expected_fs_path = fs_path.to_string() + "/" + &file_name;

        assert!(result.is_ok());
        let result_path = result.unwrap();
        let expected_resource_url =
            resource_url_from_fs_path(&expected_fs_path, &config.features_folder_path).unwrap();

        assert_eq!(result_path, expected_resource_url);
        assert_eq!(Path::new(&expected_fs_path).exists(), true);
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
            .ok_or_else(|| {
                "Could not extract fs id from resource id. No path components".to_string()
            })
    }
}
