use std::fs::DirBuilder;
use std::path::Path;
use uuid::Uuid;

type ResourceId = String;
type FsId = String;

struct Metadata {}
struct Content {}

trait PolyOutTrait {
    fn metadata(resource_id: ResourceId) -> Result<Metadata, String>;
    fn read(resource_id: ResourceId) -> Result<Content, String>;
    fn remove(resource_id: ResourceId) -> Result<(), String>;
    // import will decide if it needs to unzip a file. The contents of the url will be extracted and inserted into a database.
    fn import(
        url: String,
        feature_name: String,
        dest_resource_id: Option<ResourceId>,
    ) -> Result<ResourceId, String>;
}

struct PolyOut {}

impl PolyOut {
    fn fs_id_from_resource_id(resource_id: ResourceId) -> FsId {
        // TODO
        return "".to_string();
    }

    fn resource_id_from_fs_id(fs_id: FsId) -> ResourceId {
        // TODO
        return "".to_string();
    }

    fn file_system_url_from_fs_id(fs_id: FsId) -> String {
        // TODO
        return "".to_string();
    }

    fn feature_files_path(feature_name: String) -> String {
        // TODO: Create a path that will work on iOS, Android and Web
        let path = format!("~/Documents/Developer/Tests/PolyPoly/{}", feature_name);
        return path;
    }

    fn make_sure_feature_files_dir_exists(feature_name: String) -> Result<(), String> {
        let files_path = PolyOut::feature_files_path(feature_name);
        if !Path::new(&files_path).exists() {
            DirBuilder::new()
                .recursive(true)
                .create(files_path)
                .map_err(|err| err.to_string())?;
        }
        Ok(())
    }
}

impl PolyOutTrait for PolyOut {
    fn import(
        url: String,
        feature_name: String,
        dest_resource_id: Option<ResourceId>,
    ) -> Result<ResourceId, String> {
        PolyOut::make_sure_feature_files_dir_exists(feature_name)?;

        let fs_id = match dest_resource_id {
            Some(res_id) => PolyOut::fs_id_from_resource_id(res_id),
            None => Uuid::new_v4().to_string(),
        };

        let target = PolyOut::file_system_url_from_fs_id(fs_id.to_string());

        //TODO: unzip in target

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
    fn test_fs_id_from_resource_id() {
        assert_eq!("", "a");
    }

    #[test]
    fn test_resource_id_from_fs_id() {
        assert_eq!("", "a");
    }

    #[test]
    fn test_file_system_url_from_fs_id() {
        assert_eq!("", "a");
    }
}
