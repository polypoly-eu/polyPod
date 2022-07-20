use std::fs::{DirBuilder, File};
use std::path::Path;
use url::Url;
use uuid::Uuid;
use zip::ZipArchive;

type ResourceId = String;
type FsId = String;

struct Metadata {}
struct Content {}

// Feature File System is exposed to the feature
// Platform File System is what the Feature File System uses under the hood.
// Different platforms can have different file systems
// Different features have the same file system.
trait FeatureFileSystemTrait {
    fn metadata(resource_id: ResourceId) -> Result<Metadata, String>;
    // if you read a directory it will give you back the files and folders inside of it.
    // if you read a file, it will give you back the contents of that file (as a string?)
    // what will the return type be?
    fn read(resource_id: ResourceId) -> Result<Content, String>;
    // removing files or directories is not different from each other.
    fn remove(resource_id: ResourceId) -> Result<(), String>;
    // import will decide if it needs to unzip a file. The contents of the url will be extracted and inserted into a database.
    fn import(url: String, dest_resource_id: Option<ResourceId>) -> Result<ResourceId, String>;
}

// Rename to FeatureFileSystem
struct FeatureFileSystem {}

impl FeatureFileSystem {
    fn fs_id_from_resource_id(resource_id: ResourceId) -> Result<FsId, String> {
        let url = Url::parse(&resource_id).map_err(|err| err.to_string())?;
        if url.scheme() != "polypod" {
            return Err("Not a polypod resource id".to_string());
        }
        url.last_segment()
    }

    fn fs_id_from_fs_url(fs_url: String) -> Result<FsId, String> {
        let url = Url::parse(&fs_url).map_err(|err| err.to_string())?;
        url.last_segment()
    }

    fn resource_id_from_fs_id(fs_id: FsId) -> ResourceId {
        return "polypod://FeatureFiles/".to_string() + &fs_id;
    }

    fn fs_url_from_fs_id(fs_id: FsId, feature_name: String) -> String {
        return FeatureFileSystem::feature_files_path(feature_name) + "/" + &fs_id;
    }

    #[allow(dead_code)]
    fn fs_url_from_resource_id(
        resource_id: ResourceId,
        feature_name: String,
    ) -> Result<String, String> {
        let fs_id = FeatureFileSystem::fs_id_from_resource_id(resource_id)?;
        return Ok(FeatureFileSystem::fs_url_from_fs_id(fs_id, feature_name));
    }

    #[allow(dead_code)]
    fn resource_id_from_fs_url(fs_url: String) -> Result<String, String> {
        let fs_id = FeatureFileSystem::fs_id_from_fs_url(fs_url)?;
        return Ok(FeatureFileSystem::resource_id_from_fs_id(fs_id));
    }

    fn features_path() -> String {
        // TODO: Create a path that will work on iOS, Android and Web
        env!("CARGO_MANIFEST_DIR").to_string() + "/TestFeatures/"
    }

    fn feature_files_path(feature_name: String) -> String {
        let path = FeatureFileSystem::features_path() + &feature_name;
        return path;
    }

    fn make_sure_feature_files_dir_exists(feature_name: String) -> Result<(), String> {
        let files_path = FeatureFileSystem::feature_files_path(feature_name);
        let path = Path::new(&files_path);
        if !path.exists() {
            DirBuilder::new()
                .recursive(true)
                .create(path)
                .map_err(|err| err.to_string())?;
        }
        Ok(())
    }

    fn feature_name() -> Result<String, String> {
        // TODO: Ask platform. Note: function also used by tests. We need to mock it.
        Ok("Test".to_string())
    }
}

impl FeatureFileSystemTrait for FeatureFileSystem {
    fn import(url: String, dest_resource_id: Option<ResourceId>) -> Result<ResourceId, String> {
        let feature_name = FeatureFileSystem::feature_name()?;

        //TODO: Transfer to FeatureFileSystem interface in the future.
        FeatureFileSystem::make_sure_feature_files_dir_exists(feature_name.to_string())?;

        let fs_id = match dest_resource_id {
            Some(res_id) => FeatureFileSystem::fs_id_from_resource_id(res_id),
            None => Ok(Uuid::new_v4().to_string()),
        }?;

        let fs_url =
            FeatureFileSystem::fs_url_from_fs_id(fs_id.to_string(), feature_name.to_string());

        let file = File::open(Path::new(&url)).map_err(|err| err.to_string())?;
        let mut archive = ZipArchive::new(file).map_err(|err| err.to_string())?;
        archive
            .extract(Path::new(&fs_url))
            .map_err(|err| err.to_string())?;

        let resource_id = FeatureFileSystem::resource_id_from_fs_id(fs_id.to_string());
        return Ok(resource_id);
    }

    fn metadata(resource_id: ResourceId) -> Result<Metadata, String> {
        Err("mda".to_string())
    }
    fn read(resource_id: ResourceId) -> Result<Content, String> {
        Err("mda".to_string())
    }
    fn remove(resource_id: ResourceId) -> Result<(), String> {
        Err("mda".to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fs_id_from_resource_id_valid() {
        let fs_id = "8970r10972490710497291".to_string();
        let res_id = "polypod://FeatureFiles/".to_string() + &fs_id;
        let result = FeatureFileSystem::fs_id_from_resource_id(res_id);
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), fs_id);
    }

    #[test]
    fn test_fs_id_from_resource_id_invalid_scheme() {
        let res_id = "hello://FeatureFiles/".to_string();
        let result = FeatureFileSystem::fs_id_from_resource_id(res_id);
        assert!(result.is_err());
    }

    #[test]
    fn test_fs_id_from_resource_id_invalid_path() {
        let res_id = "hello://".to_string();
        let result = FeatureFileSystem::fs_id_from_resource_id(res_id);
        assert!(result.is_err());
    }

    #[test]
    fn test_fs_url_from_resource_id() {
        let fs_id = "8970r10972490710497291".to_string();
        let res_id = "polypod://FeatureFiles/".to_string() + &fs_id;
        let result = FeatureFileSystem::fs_url_from_resource_id(
            res_id,
            FeatureFileSystem::feature_name().unwrap(),
        );
        assert!(result.is_ok());

        let fs_url =
            FeatureFileSystem::fs_url_from_fs_id(fs_id, FeatureFileSystem::feature_name().unwrap());
        assert_eq!(result.unwrap(), fs_url);
    }

    #[test]
    fn test_resource_id_from_fs_url() {
        let fs_id = "8970r10972490710497291".to_string();
        let fs_url = "file://Something/FeatureFiles/Test/".to_string() + &fs_id;
        let result = FeatureFileSystem::resource_id_from_fs_url(fs_url);
        assert!(result.is_ok());

        let resource_id = FeatureFileSystem::resource_id_from_fs_id(fs_id);
        assert_eq!(result.unwrap(), resource_id);
    }

    #[test]
    fn test_import_creates_features_dir() {
        let url = env!("CARGO_MANIFEST_DIR").to_string() + "/src/test_files/test.zip";
        let result = FeatureFileSystem::import(url, None);
        assert!(result.is_ok());
        assert_eq!(
            Path::new(&FeatureFileSystem::feature_files_path(
                FeatureFileSystem::feature_name().unwrap()
            ))
            .exists(),
            true
        );
        std::fs::remove_dir_all(Path::new(&FeatureFileSystem::features_path())).unwrap();
    }

    #[test]
    fn test_import_creates_unzips_successfully() {
        let url = env!("CARGO_MANIFEST_DIR").to_string() + "/src/test_files/test.zip";
        let result = FeatureFileSystem::import(url, None);
        assert!(result.is_ok());

        let file_path = FeatureFileSystem::fs_url_from_resource_id(
            result.unwrap(),
            FeatureFileSystem::feature_name().unwrap(),
        )
        .unwrap()
            + "/test";
        assert_eq!(Path::new(&file_path).exists(), true);

        std::fs::remove_dir_all(Path::new(&FeatureFileSystem::features_path())).unwrap();
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
