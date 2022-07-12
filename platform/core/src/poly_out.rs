trait PolyOut {
  // metadata replaces readDir. The metadata of a folder resource will contain the name of the files and folders inside that folder.
  fn metadata(resource_id: ResourceId) -> Result<Metadata, &str>;
  // read will return the content of a resource
  // if you read a file, it will return the content
  // if you read a dir, it will return an error, telling you that you should read each file individually
  fn read(resource_id: ResourceId) -> Result<Content, &str>;
  fn write(resource_id: String, content: Content) -> Result<Void, &str>;
  fn stat(resource_id: ResourceId) -> Result<Stats, &str>;
  fn importArchive(url: String, dest_resource_id: ResourceId) -> Result<ResourceId, &str>;
  fn removeArchive(resource_id: ResourceId) -> Result<Void, &str>;
}

trait Stats {}

enum ResourceType {
  File,
  Folder,
}
struct ResourceId {
  res_type: ResourceType,
}

trait Metadata {}

trait Content {}