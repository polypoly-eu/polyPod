use oxigraph::store::Store;
use oxigraph::model::*;
use oxigraph::sparql::QueryResults;

use crate::core_failure::CoreFailure;

pub type SPARQLQuery = String;



pub fn rdf_query(query: SPARQLQuery) -> Result<QueryResults, CoreFailure> {
    let store = Store::open("example.db").map_err(|_| CoreFailure::core_not_bootstrapped())?;
    store.query(&query).map_err(|_| CoreFailure::core_not_bootstrapped())
}

pub fn rdf_update(query: SPARQLQuery) -> Result<(), CoreFailure> {
    let store = Store::open("example.db").map_err(|_| CoreFailure::core_not_bootstrapped())?;
    store.update(&query).map_err(|_| CoreFailure::core_not_bootstrapped())
}



#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_insertion() {
        let store = Store::open("example.db").map_err(|_| CoreFailure::core_not_bootstrapped())?;
       
        // insertion
        let ex = NamedNode::new("http://example.com").unwrap();
        let quad = Quad::new(ex.clone(), ex.clone(), ex.clone(), GraphName::DefaultGraph);
        store.insert(&quad).unwrap();

        // quad filter
        let results = store.quads_for_pattern(Some(ex.as_ref().into()), None, None, None).collect::<Result<Vec<Quad>,_>>().unwrap();
        assert_eq!(vec![quad], results);

        // SPARQL query
        if let QueryResults::Solutions(mut solutions) =  store.query("SELECT ?s WHERE { ?s ?p ?o }").unwrap() {
            assert_eq!(solutions.next().unwrap().unwrap().get("s"), Some(&ex.into()));
        }
    }
}