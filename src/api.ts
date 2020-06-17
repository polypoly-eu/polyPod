/**
 * API type description for the interaction between Feature and Pod.
 *
 * The main interfaces is [[Pod]] for the interface that the Feature sees.
 * @packageDocumentation
 */

import * as RDF from "rdf-js";
import {Fetch} from "./fetch";
import {FS} from "./fs";

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
 * Features _must_ use the [[factory]] to create any RDF term they intend to pass to the interface, e.g. for querying
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
     *
     * The factory is an exception in that it is synchronous as opposed to the general asynchronous [[Pod]] API. This is
     * by design for these reasons:
     *
     * 1. Features may construct a large number of RDF terms. Eventually, those will likely be saved in the Pod using
     *    the [[add]] call. Round-tripping the construction of those terms across an asynchronous boundary will lead
     *    to an unacceptable runtime overhead.
     * 2. There are many small, self-contained data factory implementations that can be shipped with Pods, for example
     *    [@rdfjs/data-model](https://github.com/rdfjs-base/data-model). The Polypoly `rdf-spec` package can be used to
     *    ensure correctness of the factory implementations.
     * 3. There is no point in imposing access-control over manipulation of RDF terms before they are stored in the Pod.
     * 4. Pod implementors may choose to provide a custom implementation for more efficient serialization of RDF terms
     *    that are passed into the Pod. This is much easier to implement when the Pod controls the creation of terms.
     *
     * Pertaining to the last point, Features _must_ use the factory to create new RDF terms.
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
     * Features cannot rely on obtaining a complete view of the data using this method. The results may only reflect a
     * filtered subset due to e.g. access restrictions or incomplete synchronization across multiple machines.
     *
     * @param matcher a [[Matcher]] where any property may be left unspecified
     *
     * @returns a set of triples that conform to the specified [[Matcher]]
     */
    select(matcher: Partial<Matcher>): Promise<RDF.Quad[]>;

    /**
     * Instructs the Pod to add triples to the store. Successful storage is not guaranteed, as that may be contingent
     * on other constraints, e.g. access restrictions or synchronization across multiple machines.
     *
     * In general, (synchronous) storage errors _should_ be propagated by the Pod to the Feature, resulting in this
     * method throwing an exception or returning a failed promise. Causes for this include, but are not limited to:
     *
     * - any of the triples is malformed, e.g. not using the default graph
     * - internal storage error, e.g. disk not writable
     * - permission violation
     *
     * Failures that are handed to the Feature should be handled by the Feature, for example by providing a fallback
     * option or some form of UI to inform the user of the failure. Other errors are handled by the Pod directly, for
     * example failure of synchronization across multiple devices.
     *
     * @param quads the triples that should be stored in the Pod
     */
    add(...quads: RDF.Quad[]): Promise<void>;
}


/**
 * `PolyOut` specifies the interaction of the Feature with the environment. It is concerned with file system operations
 * and HTTP requests.
 *
 * Both of these aspects are separated out into their own modules:
 * - [[FS]] for Node.js-style file-system access
 * - [[Fetch]] for DOM-style HTTP requests
 */
export interface PolyOut extends FS {
    /**
     * A standard-compliant implementation of [[Fetch]].
     */
    readonly fetch: Fetch;
}

/**
 * This interface represents the API that a Pod offers to a Feature. It comprises multiple sub-components that are
 * concerned with different aspects. Those sub-components are grouped according to data flow (see member documentation
 * for details).
 *
 * Pod implementors may use any technology they see fit to provide the API, including remote procedure calls or HTTP
 * requests, as long as that is transparent to the Features. To that extent, the API is designed to be asynchronous,
 * i.e. all methods return promises. The only exception is the RDF data factory; see [[PolyIn.factory]] for details.
 */
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
