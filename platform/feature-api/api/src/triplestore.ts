import * as RDFJS from "rdf-js";

/**
 * For SELECT queries an array of Map objects which keys are the
 * bound variables and values are the values the result is bound to,
 * for CONSTRUCT and ÐESCRIBE queries an array of quads, for ASK queries a boolean.
 * @alias SPARQLQueryResult
 */
export type SPARQLQueryResult =
    | Map<string, RDFJS.Term>[]
    | RDFJS.Quad[]
    | boolean;

/*
 * `Triplestore` is used to access the features own RDF-SPARQL database and get the interface to operate on it
 */
export interface Triplestore {
    /**
     * Executes a SPARQL 1.1 SELECT, CONSTRUCT, DESCRIBE, or ASK query given
     * and returns the answer as a [[SPARQLQueryResult]] object.
     * @param {string} query - The query to execute.
     * @returns {SPARQLQueryResult} A promise that will be resolved with the result of the query.
     */
    query(query: string): Promise<SPARQLQueryResult>;

    /**
     * Executes a SPARQL 1.1 UPDATE query.
     * @param {string} query - The query to execute.
     * @returns A promise that will be resolved with undefined when the changes
     * have been applied and written to disk.
     */
    update(query: string): Promise<void>;
}
