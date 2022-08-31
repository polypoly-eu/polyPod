use oxigraph::store::Store;
use std::path::PathBuf;
use crate::rdf_failure::RdfFailure;

pub use oxigraph::sparql::{QueryResults, QueryResultsFormat};
pub type SPARQLQuery = String;
pub type SPARQLUpdate = String;

pub struct RDFStore {
    db: Store
}

impl RDFStore {
    pub fn new(db_path: PathBuf) -> Result<RDFStore, RdfFailure> {
        Ok(RDFStore {
            db: Store::open(db_path).map_err(RdfFailure::failed_to_initialize_store)?
        })
    }

    pub fn query(&self, query: SPARQLQuery) -> Result<QueryResults, RdfFailure> {
        self.db.query(&query).map_err(RdfFailure::map_evaluation_error)
    }

    pub fn update(&self, update: SPARQLUpdate) -> Result<(), RdfFailure> {
        self.db.update(&update).map_err(RdfFailure::map_evaluation_error)
    }
}
