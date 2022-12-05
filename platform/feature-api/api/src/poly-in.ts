import * as RDFJS from "rdf-js";

/**
 * A matcher for querying data via [[PolyIn]]. Any property can be left
 * unspecified.
 */
export interface Matcher {
    graph: RDFJS.Quad_Graph;
    subject: RDFJS.Quad_Subject;
    predicate: RDFJS.Quad_Predicate;
    object: RDFJS.Quad_Object;
}

/**
 * `PolyIn`, mysteriously named for historical reasons, offers access to the
 * polyPod's internal triplestore through an API that follows the
 * [RDFJS](http://rdf.js.org/) specification.
 *
 * To create RDF terms that can be passed to `PolyIn`, use
 * [[Pod.dataFactory]]. Please note that blank nodes, variables, or graphs other
 * than the default graph are not reliably supported across all platforms and
 * therefore best avoided.
 *
 * @see [[PolyOut]] for storing larger amounts of data.
 * @see [[Triplestore]] for an experimental, more adequately named, replacement
 * for `PolyIn`.
 *
 */

export interface PolyIn {
    /**
     * Adds a quad.
     *
     * @param quad - The quad to store.
     */
    add(quad: RDFJS.Quad): Promise<void>;

    /**
     * Deletes a quad.
     *
     * @param quad - The quad to delete.
     */
    delete(quad: RDFJS.Quad): Promise<void>;

    /**
     * Checks whether a specific quad has been stored.
     *
     * @param quad - The quad to look for.
     * @returns `true` if it exists, otherwise `false`.
     */
    has(quad: RDFJS.Quad): Promise<boolean>;

    /**
     * Queries for quads matching the given matcher.
     *
     * For each property specified in the matcher, the result set is
     * narrowed to only contain quads that match it exactly.
     *
     * For example, the following query only returns quads with the subject
     * IRI `http://example.org`:
     *
     * ```
     * const results = await polyIn.match({
     *     subject: dataFactory.namedNode("http://example.org")
     * })
     * ```
     *
     * @param matcher - The matcher.
     * @returns A list of quads that conform to the specified matcher.
     */
    match(matcher: Partial<Matcher>): Promise<RDFJS.Quad[]>;
}
