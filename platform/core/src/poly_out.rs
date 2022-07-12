trait PolyOut {
  // list all the resource ids
  fn list() -> Result<[ResourceId], &str>;
  // metadata replaces readDir and stats. 
  // The metadata of a folder resource will contain the name of the files and folders inside that folder plus what stats contains atm.
  fn metadata(resource_id: ResourceId) -> Result<Metadata, &str>;
  // read will return the content of a resource
  // if you read a file, it will return the content
  // if you read a dir, it will return an error, telling you that you should read each file individually
  fn read(resource_id: ResourceId) -> Result<Content, &str>;
  // You don't need a resource id if you want to write. It will return you a new resource id if you don't pass one
  // If you do, it will write to that resource you specified.
  // We might need some options like appending to the end of a file.
  // write is a combination of create + update
  fn write(content: Content, dest_resource_id: Optional<ResourceId>, write_options: Optional<WriteOptions>) -> Result<ResourceId, &str>;
  fn unzip(url: String, dest_resource_id: Optional<ResourceId>) -> Result<ResourceId, &str>;
  fn remove(resource_id: ResourceId) -> Result<Void, &str>;
}

trait Stats {}

enum ResourceType {
  File,
  Folder,
}
struct ResourceId {
  res_type: ResourceType,
  uuid: String, 
  name: String
}

enum WriteOptions {
  Append,
  Override
}

trait Metadata {}

trait Content {}