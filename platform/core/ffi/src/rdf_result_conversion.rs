use oxigraph::sparql::{QueryResults, QueryResultsFormat};
use core_failure::CoreFailure;

pub fn to_json_bytes(query_results: QueryResults) -> Result<Vec<u8>, CoreFailure> {
    let mut results = Vec::new();
    match query_results.write(&mut results, QueryResultsFormat::Json) {
        Ok(_) => Ok(results),
        Err(error) => Err(CoreFailure::map_sparql_evaluation_error(error)),
    }
}

pub fn bytes_to_string(utf8_byte_array: Vec<u8>) -> Result<String, CoreFailure> {
    match std::str::from_utf8(&utf8_byte_array) {
        Ok(result) => Ok(result.to_string()),
        Err(error) => Err(CoreFailure::utf8_conversion_error(error)),
    }
}
