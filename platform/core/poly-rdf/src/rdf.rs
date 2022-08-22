use oxigraph::sparql::{Query, QueryResultsFormat, Update};
use oxigraph::store::{StorageError, Store};
use std::str;

use crate::rdf_failure::RdfFailure;

pub type SPARQLQuery = String;

fn init_store(app_path: String) -> Result<Store, StorageError> {
    Store::open(app_path + env!("RDF_DB_PATH"))
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

pub fn rdf_query(query: SPARQLQuery, app_path: String) -> Result<String, RdfFailure> {
    let store = init_store(app_path).map_err(RdfFailure::failed_to_initialize_store)?;
    match check_query(query.to_string()) {
        Ok(_) => {
            let query_results = store
                .query(&query)
                .map_err(RdfFailure::map_evaluation_error)?;
            bytes_to_string(to_json_bytes(query_results)?)
        }
        Err(error) => Err(error),
    }
}

pub fn rdf_update(query: SPARQLQuery, app_path: String) -> Result<(), RdfFailure> {
    let store = init_store(app_path).map_err(RdfFailure::failed_to_initialize_store)?;
    match check_update(query.to_string()) {
        Ok(_) => store
            .update(&query)
            .map_err(RdfFailure::map_evaluation_error),
        Err(error) => Err(error),
    }
}

fn to_json_bytes(query_results: oxigraph::sparql::QueryResults) -> Result<Vec<u8>, RdfFailure> {
    let mut results = Vec::new();
    match query_results.write(&mut results, QueryResultsFormat::Json) {
        Ok(_) => Ok(results),
        Err(error) => Err(RdfFailure::map_evaluation_error(error)),
    }
}

fn bytes_to_string(utf8_byte_array: Vec<u8>) -> Result<String, RdfFailure> {
    match str::from_utf8(&utf8_byte_array) {
        Ok(result) => Ok(result.to_string()),
        Err(error) => Err(RdfFailure::map_utf8_error(error)),
    }
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn test_query_result_mapping_to_serialize() {
        let _update_result = rdf_update(
            String::from(
                "INSERT DATA { <http://example.com/you> <http://example.com/are> \"great\" }",
            ),
            String::from("."),
        );

        let query_result = rdf_query(
            String::from(
                "
            SELECT ?s ?p ?o WHERE {
                ?s ?p ?o
            }
        ",
            ),
            String::from("."),
        )
        .unwrap();

        print!("{:?}", query_result);

        let store = init_store(".".to_string()).unwrap();
        let _ = store.clear();

        assert_eq!(query_result, "{\"head\":{\"vars\":[\"s\",\"p\",\"o\"]},\"results\":{\"bindings\":[{\"s\":{\"type\":\"uri\",\"value\":\"http://example.com/you\"},\"p\":{\"type\":\"uri\",\"value\":\"http://example.com/are\"},\"o\":{\"type\":\"literal\",\"value\":\"great\"}}]}}".to_string())
    }
}
