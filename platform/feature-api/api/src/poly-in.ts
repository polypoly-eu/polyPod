import * as RDFJS from "rdf-js";

/**
 * A _matcher_ specifies a filter for querying the Pod store.
 */
export interface Matcher {
    graph: RDFJS.Quad_Graph;
    subject: RDFJS.Quad_Subject;
    predicate: RDFJS.Quad_Predicate;
    object: RDFJS.Quad_Object;
}

/**
 * `PolyIn` specifies the interaction of the Feature with the Pod store. It is concerned with creating and manipulating
 * RDF triples according to the [RDFJS](http://rdf.js.org/) specification.
 *
 * Features _must_ use the [[Pod.dataFactory]] to create any RDF term they intend to pass to the interface, e.g. for
 * querying and storing, or alternatively re-use RDF terms that have been obtained through PolyIn via other means. It is
 * not allowed to use other data factory implementations.
 *
 * Features _may_ rely on the convention that all RDF triples stored in the Pod are associated with the default graph.
 * In other words, when querying for quads, for all returned quads, the expression `q.graph.equals(factory.defaultGraph())`
 * will hold true. Conversely, Features _should_ only attempt to store quads with the default graph in the Pod, since
 * storage is otherwise not guaranteed.
 *
 * The Pod may impose additional restrictions on the shape of RDF terms that may be stored or queried, for example
 * access control based on IRIs. The Pod may also store additional metadata that is not reified in the RDF data model,
 * e.g. timestamps and origin of read or write access for the purpose of auditing. Features _should not_ confuse empty
 * queries with lack of data, as query results may additionally be filtered.
 *
 * Using blank nodes or variables in any position results in implementation-defined behaviour and should not be relied
 * on, except for internal purposes of the Feature.
 */
export interface PolyIn {
    /**
     * Queries the Pod for triples matching the given filter. For each property ([[Matcher.subject]],
     * [[Matcher.predicate]], [[Matcher.object]]) that is specified in the argument, the result set is narrowed to only
     * contain triples that match the property exactly.
     *
     * For example, when querying the store as follows:
     *
     * ```
     * const results = await polyIn.match({
     *     subject: factory.namedNode("http://example.org")
     * })
     * ```
     *
     * ... the result is guaranteed to only contain triples with the subject IRI `http://example.org`.
     *
     * Features cannot rely on obtaining a complete view of the data using this method. The results may only reflect a
     * filtered subset due to e.g. access restrictions or incomplete synchronization across multiple machines.
     * @param {Partial<Matcher>} matcher - a [[Matcher]] where any property may be left unspecified
     * @returns {Array.<Quad>} - A set of triples that conform to the specified [[Matcher]] as an array of [[Quad]]s.
     */
    match(matcher: Partial<Matcher>): Promise<RDFJS.Quad[]>;

    /**
     * It adds the [[QuadStore]] passed.
     * Instructs the Pod to add a triple to the store. Successful storage is not guaranteed, as that may be contingent
     * on other constraints, e.g. access restrictions or synchronization across multiple machines.
     *
     * In general, (synchronous) storage errors _should_ be propagated by the Pod to the Feature, resulting in this
     * method throwing an exception or returning a failed promise. Causes for this include, but are not limited to:
     *
     * - the triple is malformed, e.g. not using the default graph
     * - internal storage error, e.g. disk not writable
     * - permission violation
     *
     * Failures that are handed to the Feature should be handled by the Feature, for example by providing a fallback
     * option or some form of UI to inform the user of the failure. Other errors are handled by the Pod directly, for
     * example failure of synchronization across multiple devices.
     *
     * @param {Quad} quad - The quad triple that should be stored in the Pod
     * @returns {void}
     */
    add(quad: RDFJS.Quad): Promise<void>;

    /**
     * Deletes the indicated triples [Quad]].
     *
     * @param  {Quad} quad - the triple [[Quad]] that should be removed from the Pod
     * @returns {void}
     */
    delete(quad: RDFJS.Quad): Promise<void>;

    /**
     * Checks whether the set of triple (called quads because they include the graph or namespace)
     * is included in the pod. Returns true if they do.
     *
     * @param {Quad} quad - the triple to check for in the Pod
     * @returns a Promise that will be resolved to a boolean.
     */
    has(quad: RDFJS.Quad): Promise<boolean>;
}
