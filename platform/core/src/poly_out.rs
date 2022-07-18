trait PolyOutTrait {
  fn metadata(resource_id: ResourceId) -> Result<Metadata, &str>;
  fn read(resource_id: ResourceId) -> Result<Content, &str>;
  fn remove(resource_id: ResourceId) -> Result<Void, &str>;
  // import will decide if it needs to unzip a file. The contents of the url will be extracted and inserted into a database.
  fn import(url: String, dest_resource_id: Optional<ResourceId>) -> Result<ResourceId, &str>;
}

impl PolyOut for PolyOutTrait {

}

enum ResourceType {
  File,
  Folder,
}

struct ResourceId {
  res_type: ResourceType,
  uuid: String, 
  name: String,
  // associated feature with this resource - backlink ?
  assoc_feature: String,
}

trait Metadata {}

trait Content {}