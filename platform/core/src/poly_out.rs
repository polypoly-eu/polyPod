use std::fs::{DirBuilder, File};
use std::path::Path;
use url::Url;
use uuid::Uuid;
use zip::ZipArchive;

type ResourceId = String;
type FsId = String;

struct Metadata {}
struct Content {}

trait PolyOutTrait {
    fn metadata(resource_id: ResourceId) -> Result<Metadata, String>;
    fn read(resource_id: ResourceId) -> Result<Content, String>;
    fn remove(resource_id: ResourceId) -> Result<(), String>;
    // import will decide if it needs to unzip a file. The contents of the url will be extracted and inserted into a database.
    fn import(url: String, dest_resource_id: Option<ResourceId>) -> Result<ResourceId, String>;
}

struct PolyOut {}

impl PolyOut {
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
        return PolyOut::feature_files_path(feature_name) + "/" + &fs_id;
    }

    #[allow(dead_code)]
    fn fs_url_from_resource_id(
        resource_id: ResourceId,
        feature_name: String,
    ) -> Result<String, String> {
        let fs_id = PolyOut::fs_id_from_resource_id(resource_id)?;
        return Ok(PolyOut::fs_url_from_fs_id(fs_id, feature_name));
    }

    #[allow(dead_code)]
    fn resource_id_from_fs_url(fs_url: String) -> Result<String, String> {
        let fs_id = PolyOut::fs_id_from_fs_url(fs_url)?;
        return Ok(PolyOut::resource_id_from_fs_id(fs_id));
    }

    fn features_path() -> String {
        // TODO: Create a path that will work on iOS, Android and Web
        env!("CARGO_MANIFEST_DIR").to_string() + "/TestFeatures/"
    }

    fn feature_files_path(feature_name: String) -> String {
        let path = PolyOut::features_path() + &feature_name;
        return path;
    }

    fn make_sure_feature_files_dir_exists(feature_name: String) -> Result<(), String> {
        let files_path = PolyOut::feature_files_path(feature_name);
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

impl PolyOutTrait for PolyOut {
    fn import(url: String, dest_resource_id: Option<ResourceId>) -> Result<ResourceId, String> {
        let feature_name = PolyOut::feature_name()?;

        //TODO: Transfer to FileSystem interface in the future.
        PolyOut::make_sure_feature_files_dir_exists(feature_name.to_string())?;

        let fs_id = match dest_resource_id {
            Some(res_id) => PolyOut::fs_id_from_resource_id(res_id),
            None => Ok(Uuid::new_v4().to_string()),
        }?;

        let fs_url = PolyOut::fs_url_from_fs_id(fs_id.to_string(), feature_name.to_string());

        let file = File::open(Path::new(&url)).map_err(|err| err.to_string())?;
        let mut archive = ZipArchive::new(file).map_err(|err| err.to_string())?;
        archive
            .extract(Path::new(&fs_url))
            .map_err(|err| err.to_string())?;

        //TODO: write metadata for this resource id - add the files that are part of this
        //resource id.

        let resource_id = PolyOut::resource_id_from_fs_id(fs_id.to_string());
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
        let result = PolyOut::fs_id_from_resource_id(res_id);
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), fs_id);
    }

    #[test]
    fn test_fs_id_from_resource_id_invalid_scheme() {
        let res_id = "hello://FeatureFiles/".to_string();
        let result = PolyOut::fs_id_from_resource_id(res_id);
        assert!(result.is_err());
    }

    #[test]
    fn test_fs_id_from_resource_id_invalid_path() {
        let res_id = "hello://".to_string();
        let result = PolyOut::fs_id_from_resource_id(res_id);
        assert!(result.is_err());
    }

    #[test]
    fn test_import_creates_features_dir() {
        let url = env!("CARGO_MANIFEST_DIR").to_string() + "/src/test_files/test.zip";
        let result = PolyOut::import(url, None);
        assert!(result.is_ok());
        assert_eq!(
            Path::new(&PolyOut::feature_files_path(
                PolyOut::feature_name().unwrap()
            ))
            .exists(),
            true
        );
        std::fs::remove_dir_all(Path::new(&PolyOut::features_path())).unwrap();
    }

    #[test]
    fn test_import_creates_unzips_successfully() {
        let url = env!("CARGO_MANIFEST_DIR").to_string() + "/src/test_files/test.zip";
        let result = PolyOut::import(url, None);
        assert!(result.is_ok());

        let file_path =
            PolyOut::fs_url_from_resource_id(result.unwrap(), PolyOut::feature_name().unwrap())
                .unwrap()
                + "/test";
        assert_eq!(Path::new(&file_path).exists(), true);

        std::fs::remove_dir_all(Path::new(&PolyOut::features_path())).unwrap();
    }

    // #[test]
    // fn test_resource_id_from_fs_id() {
    //     assert_eq!("", "a");
    // }

    // #[test]
    // fn test_file_system_url_from_fs_id() {
    //     assert_eq!("", "a");
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
