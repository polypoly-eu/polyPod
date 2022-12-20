import * as RDFJS from "rdf-js";

/**
 * For SELECT queries, an array of Map objects whose keys are the
 * bound variables and whose values are the values the result is bound to.
 * For CONSTRUCT and DESCRIBE queries, an array of quads.
 * For ASK queries, a boolean.
 */
export type SPARQLQueryResult =
    | Map<string, RDFJS.Term>[]
    | RDFJS.Quad[]
    | boolean;

/**
 * `Triplestore`, an experimental replacement for [[PolyIn]], allows Features to
 * access the polyPod's internal triplestore via SPARQL queries.
 *
 * For the time being, the underlying stores of `PolyIn` and `Triplestore` are
 * separate, so these two APIs are not able to operate on the same data.
 * Being experimental, we strongly recommend to use `PolyIn` instead.
 *
 * @experimental
 */
export interface Triplestore {
    /**
     * Executes a SPARQL 1.1 SELECT, CONSTRUCT, DESCRIBE, or ASK query.
     * @param query - The query to execute.
     * @returns The result of the query.
     */
    query(query: string): Promise<SPARQLQueryResult>;

    /**
     * Executes a SPARQL 1.1 UPDATE query.
     * @param query - The query to execute.
     */
    update(query: string): Promise<void>;
}
