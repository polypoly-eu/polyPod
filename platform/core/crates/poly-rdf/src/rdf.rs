use oxigraph::{store::{StorageError, Store}, sparql::QueryResults};
use std::path::PathBuf;
use spargebra::{Query, Update};

use crate::rdf_failure::RdfFailure;

pub type SPARQLQuery = String;

fn init_store(app_path: PathBuf) -> Result<Store, StorageError> {
    let mut store_path = app_path;
    store_path.push(env!("RDF_DB_PATH"));
    Store::open(store_path)
}

fn check_query(query: SPARQLQuery) -> Result<Query, RdfFailure> {
    match Query::parse(&query, None) {
        Ok(query) => Ok(query),
        Err(error) => Err(RdfFailure::map_query_parse_error(error)),
    }
}

fn check_update(query: SPARQLQuery) -> Result<Update, RdfFailure> {
    match Update::parse(&query, None) {
        Ok(query) => Ok(query),
        Err(error) => Err(RdfFailure::map_query_parse_error(error)),
    }
}

pub fn rdf_query(query: SPARQLQuery, app_path: PathBuf) -> Result<QueryResults, RdfFailure> {
    let store = init_store(app_path).map_err(RdfFailure::failed_to_initialize_store)?;
    match check_query(query.to_string()) {
        Ok(_) => store.query(&query).map_err(RdfFailure::map_evaluation_error),

        Err(error) => Err(error),
    }
}

pub fn rdf_update(query: SPARQLQuery, app_path: PathBuf) -> Result<(), RdfFailure> {
    let store = init_store(app_path).map_err(RdfFailure::failed_to_initialize_store)?;
    match check_update(query.to_string()) {
        Ok(_) => store
            .update(&query)
            .map_err(RdfFailure::map_evaluation_error),
        Err(error) => Err(error),
    }
}
