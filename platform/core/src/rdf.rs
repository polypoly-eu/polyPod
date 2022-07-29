use std::collections::HashMap;
use oxigraph::store::{Store, StorageError};
use serde::Deserialize;
use serde::Serialize;

use crate::rdf_failure::RdfFailure;

pub type SPARQLQuery = String;

/// A simplified serializable replica of oxigraph::sparql::QuerySolution
#[derive(Deserialize, Serialize, PartialEq, Debug, Clone)]
pub struct QuerySolution {
    values: HashMap<String, String>,
}

impl QuerySolution {
    fn new(values: HashMap<String, String>) -> Self {
        Self { values }
    }
}

/// A simplified serializable replica of oxigraph::sparql::QueryResults
/// Only Solutions for SELECT queries are currently supported
#[derive(Deserialize, Serialize, PartialEq, Debug, Clone)]
pub enum QueryResults {
    /// Results of a [SELECT](https://www.w3.org/TR/sparql11-query/#select) query.
    Solutions(Vec<QuerySolution>),
    // TODO: Implement those when needed
    // Result of a [ASK](https://www.w3.org/TR/sparql11-query/#ask) query.
    // Boolean(bool),
    // Results of a [CONSTRUCT](https://www.w3.org/TR/sparql11-query/#construct) or [DESCRIBE](https://www.w3.org/TR/sparql11-query/#describe) query.
    // Graph(QueryTripleIter),
}

fn init_store(app_path: String) -> Result<Store, StorageError> {
    Store::open(app_path + env!("RDF_DB_PATH"))
}

pub fn rdf_query(query: SPARQLQuery, app_path: String) -> Result<QueryResults, RdfFailure> {
    let store = init_store(app_path).map_err(|err| RdfFailure::failed_to_initialize_store(err))?;
    let query_results = store.query(&query).map_err(|err| RdfFailure::map_evaluation_error(err))?;
    to_serializable_format(query_results).map_err(|_| RdfFailure::result_serialization_failed())
}

pub fn rdf_update(query: SPARQLQuery, app_path: String) -> Result<(), RdfFailure> {
    let store = init_store(app_path).map_err(|err| RdfFailure::failed_to_initialize_store(err))?;
    let query_results  = store.update(&query).map_err(|err| RdfFailure::map_evaluation_error(err));
    query_results
}

fn to_serializable_format(query_results: oxigraph::sparql::QueryResults) -> Result<QueryResults, RdfFailure> {
    let mut solutions: Vec<QuerySolution> = Vec::new();
    if let oxigraph::sparql::QueryResults::Solutions(query_solutions) = query_results {
        for query_solution_result in query_solutions {
            let mut map: HashMap<String, String> = HashMap::new();
            let query_solution = query_solution_result.unwrap();
            for var in query_solution.variables().iter() {
                map.insert(var.to_string(), query_solution.get(var).unwrap().to_string());
            }
            solutions.push(QuerySolution::new(map))
        }
    }
    Ok(QueryResults::Solutions(solutions))
}


#[cfg(test)]
mod tests {

    use super::*;
    
    #[test]
    fn test_query_result_mapping_to_serialize() {
        let _update_result = rdf_update(String::from("INSERT DATA { <http://example.com/you> <http://example.com/are> \"great\" }"), String::from("."));

        let query_result = rdf_query(String::from("
            SELECT ?s ?p ?o WHERE {
                ?s ?p ?o
            }
        "), String::from(".")).unwrap();

        let test_map = HashMap::from([
            (String::from("?s"), String::from("<http://example.com/you>")),
            (String::from("?p"), String::from("<http://example.com/are>")),
            (String::from("?o"), String::from("\"great\"")),
        ]);
        let test_result = QueryResults::Solutions(vec![QuerySolution::new(test_map)]);
        
        assert_eq!(query_result, test_result)
    }
}