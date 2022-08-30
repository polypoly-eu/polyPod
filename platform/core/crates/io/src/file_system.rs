use core_failure::CoreFailure;
use std::fs::{self, DirBuilder, File};
use std::path::Path;
use url::Url;
use zip::ZipArchive;

// I think the error should not be of type core failure. How is a platform going to know about CoreFailure?
pub trait FileSystem: Sync + Send {
    fn create_dir_structure(&self, path: &str) -> Result<(), CoreFailure>;
    fn exists(&self, path: &str) -> bool;
    fn unzip(&self, from_url: &str, to_path: &str) -> Result<(), CoreFailure>;
    fn is_directory(&self, path: &str) -> bool;
    fn size(&self, path: &str) -> Result<String, CoreFailure>;
    fn time_modified(&self, path: &str) -> Result<String, CoreFailure>;
    fn remove(&self, path: &str) -> Result<(), CoreFailure>;
    fn dir_children(&self, dir_path: &str) -> Result<Vec<String>, CoreFailure>;
    fn file_content(&self, file_path: &str) -> Result<Vec<u8>, CoreFailure>;
    fn copy(&self, from_file_path: &str, to_file_path: &str) -> Result<(), CoreFailure>;
    fn name(&self, path: &str) -> Result<String, CoreFailure>;
}

pub struct DefaultFileSystem {}

impl FileSystem for DefaultFileSystem {
    fn create_dir_structure(&self, path: &str) -> Result<(), CoreFailure> {
        let _path = Path::new(path);
        DirBuilder::new()
            .recursive(true)
            .create(_path)
            .map_err(|err| {
                CoreFailure::failed_file_system_operation(path.to_string(), err.to_string())
            })
    }

    fn exists(&self, path: &str) -> bool {
        let _path = Path::new(path);
        _path.exists()
    }

    fn unzip(&self, from_url: &str, to_path: &str) -> Result<(), CoreFailure> {
        let from_url_path = Url::parse(from_url)
            .map_err(|err| CoreFailure::failed_to_parse_url(from_url.to_string(), err.to_string()))?
            .path()
            .to_string();

        let file = File::open(Path::new(&from_url_path)).map_err(|err| {
            CoreFailure::failed_file_system_operation(from_url_path.to_string(), err.to_string())
        })?;
        let mut archive = ZipArchive::new(file).map_err(|err| {
            CoreFailure::failed_file_system_operation(from_url_path.to_string(), err.to_string())
        })?;
        archive
            .extract(Path::new(to_path))
            .map_err(|err| CoreFailure::failed_to_unzip(from_url.to_string(), err.to_string()))
    }

    fn is_directory(&self, path: &str) -> bool {
        let _path = Path::new(path);
        _path.is_dir()
    }

    fn size(&self, path: &str) -> Result<String, CoreFailure> {
        let _path = Path::new(path);
        let metadata = _path.metadata().map_err(|err| {
            CoreFailure::failed_file_system_operation(path.to_string(), err.to_string())
        })?;
        Ok(metadata.len().to_string())
    }

    fn time_modified(&self, path: &str) -> Result<String, CoreFailure> {
        let _path = Path::new(path);
        let metadata = _path.metadata().map_err(|err| {
            CoreFailure::failed_file_system_operation(path.to_string(), err.to_string())
        })?;
        let time = metadata
            .modified()
            .map_err(|err| {
                CoreFailure::failed_file_system_operation(path.to_string(), err.to_string())
            })?
            .duration_since(std::time::SystemTime::UNIX_EPOCH)
            .map_err(|err| {
                CoreFailure::failed_file_system_operation(path.to_string(), err.to_string())
            })?
            .as_secs()
            .to_string();
        Ok(time)
    }

    fn remove(&self, path: &str) -> Result<(), CoreFailure> {
        let _path = Path::new(path);
        if _path.is_dir() {
            fs::remove_dir_all(_path).map_err(|err| {
                CoreFailure::failed_file_system_operation(path.to_string(), err.to_string())
            })?;
        } else {
            fs::remove_file(_path).map_err(|err| {
                CoreFailure::failed_file_system_operation(path.to_string(), err.to_string())
            })?;
        }
        Ok(())
    }

    fn dir_children(&self, dir_path: &str) -> Result<Vec<String>, CoreFailure> {
        let path = Path::new(dir_path);
        let contents = fs::read_dir(path).map_err(|err| {
            CoreFailure::failed_file_system_operation(dir_path.to_string(), err.to_string())
        })?;
        let names: Vec<String> = contents
            .filter_map(|c| c.ok())
            .filter_map(|c| c.file_name().into_string().ok())
            .collect();
        Ok(names)
    }

    fn file_content(&self, file_path: &str) -> Result<Vec<u8>, CoreFailure> {
        let path = Path::new(&file_path);
        fs::read(path).map_err(|err| {
            CoreFailure::failed_file_system_operation(file_path.to_string(), err.to_string())
        })
    }

    fn copy(&self, from_file_path: &str, to_file_path: &str) -> Result<(), CoreFailure> {
        let from = Path::new(from_file_path);
        let to = Path::new(to_file_path);
        fs::copy(from, to).map_err(|err| {
            CoreFailure::failed_file_system_operation(
                from_file_path.to_string() + " and " + to_file_path,
                err.to_string(),
            )
        })?;
        Ok(())
    }

    fn name(&self, path: &str) -> Result<String, CoreFailure> {
        let _path = Path::new(&path);
        _path
            .file_name()
            .ok_or_else(|| {
                CoreFailure::failed_file_system_operation(
                    path.to_string(),
                    "Could not get filename from path".to_string(),
                )
            })?
            .to_owned()
            .into_string()
            .map_err(|err| {
                CoreFailure::failed_file_system_operation(
                    path.to_string(),
                    err.into_string().unwrap_or_default(),
                )
            })
    }
}
