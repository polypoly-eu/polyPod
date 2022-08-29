use core_failure::CoreFailure;
use oxigraph::{sparql::QueryResults, store::Store};
use std::path::PathBuf;

pub struct Feature {
    fs_path: PathBuf,
    rdf_store: Option<Store>,
}

impl Feature {
    pub fn new(fs_path: PathBuf) -> Feature {
        Feature {
            fs_path,
            rdf_store: None,
        }
    }

    pub fn open_rdf_store(&mut self) -> Result<(), CoreFailure> {
        self.rdf_store =
            Some(Store::open(self.fs_path.join("rdf_db")).map_err(CoreFailure::map_storage_error)?);
        Ok(())
    }

    pub fn exec_rdf_query(&self, query: String) -> Result<QueryResults, CoreFailure> {
        if let Some(store) = &self.rdf_store {
            store
                .query(&query)
                .map_err(CoreFailure::map_sparql_evaluation_error)
        } else {
            Err(CoreFailure::feature_store_not_initialized())
        }
    }

    pub fn exec_rdf_update(&self, update: String) -> Result<(), CoreFailure> {
        if let Some(store) = &self.rdf_store {
            store
                .update(&update)
                .map_err(CoreFailure::map_sparql_evaluation_error)
        } else {
            Err(CoreFailure::feature_store_not_initialized())
        }
    }
}
