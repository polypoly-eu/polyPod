/**
 * API type description for the interaction between Feature and Pod.
 *
 * The main interfaces are:
 * - [[Pod]] for the interface that the Feature sees, and
 * - [[Feature]] for the interface that the Pod sees.
 * @packageDocumentation
 */

import * as RDF from "rdf-js";

/**
 * A _matcher_ specifies a filter for querying the Pod store.
 */
export interface Matcher {
    subject: RDF.Quad_Subject;
    predicate: RDF.Quad_Predicate;
    object: RDF.Quad_Object;
}

/**
 * `PolyIn` specifies the interaction of the Feature with the Pod store. It is concerned with creating and manipulating
 * RDF triples according to the [RDFJS](http://rdf.js.org/) specification.
 *
 * Features _must_ use the {@link factory} to create any RDF term they intend to pass to the interface, e.g. for querying
 * and storing, or alternatively re-use RDF terms that have been obtained through PolyIn via other means. It is not
 * allowed to use other data factory implementations.
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
     * A [spec-compliant](http://rdf.js.org/data-model-spec/) data factory that is _not_ guaranteed to support variables.
     *
     * Example:
     * ```
     * const quad = factory.triple(
     *   factory.namedNode("http://example.org/s"),
     *   factory.namedNode("http://example.org/p"),
     *   factory.namedNode("http://example.org/o")
     * );
     * ```
     */
    readonly factory: RDF.DataFactory;

    /**
     * Queries the Pod for triples matching the given filter. For each property ([[Matcher.subject]],
     * [[Matcher.predicate]], [[Matcher.object]]) that is specified in the argument, the result set is narrowed to only
     * contain triples that match the property exactly.
     *
     * For example, when querying the store as follows:
     *
     * ```
     * const results = await polyIn.select({
     *     subject: factory.namedNode("http://example.org")
     * })
     * ```
     *
     * ... the result is guaranteed to only contain triples with the subject IRI `http://example.org`.
     *
     * @param matcher a [[Matcher]] where any property may be left unspecified
     */
    select(matcher: Partial<Matcher>): Promise<RDF.Quad[]>;
    add(...quads: RDF.Quad[]): Promise<void>;
}

export interface PolyOut {
    readFile(path: string, options: { encoding: BufferEncoding }): Promise<string>;

    // TODO migrate to fetch
    httpRequest(url: string, method: string, body?: string, headers?: Record<string, string>): Promise<string>;
}

export interface Pod {
    /**
     * `polyIn` is the interface to interact with the Pod store. Refer to [[PolyIn]] for its definition.
     */
    readonly polyIn: PolyIn;

    /**
     * `polyOut` is the interface to interact with the outside world. Refer to [[PolyOut]] for its definition.
     */
    readonly polyOut: PolyOut;
}

export interface Feature {
    init(pod: Pod): Promise<void>;
}

export interface FeatureConstructor {
    new(): Feature;
}
