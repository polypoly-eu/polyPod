use crate::core_failure::CoreFailure;
use std::fs;

pub trait FileSystem {
   fn read_contents_of_file(&self, path: &str) -> Result<Vec<u8>, CoreFailure>;
} 

pub struct DefaultFileSystem {}

impl FileSystem for DefaultFileSystem {
   fn read_contents_of_file(&self, path: &str) -> Result<Vec<u8>, CoreFailure> {
       fs::read(path)
           .map_err(|err| 
                    CoreFailure::failed_to_read_contents_of_file(
                        path.to_string(), 
                        err.to_string(),
                    )
          )
   }
}
