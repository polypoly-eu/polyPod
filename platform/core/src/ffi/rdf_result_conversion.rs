use oxigraph::sparql::QueryResults;

fn to_json_bytes(query_results: QueryResults) -> Result<Vec<u8>, RdfFailure> {
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
