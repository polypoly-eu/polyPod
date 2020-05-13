/**
 * API type description for the interaction between Feature and Pod.
 *
 * The main interfaces are:
 * - [[Pod]] for the interface that the Feature sees, and
 * - [[Feature]] for the interface that the Pod sees.
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

/**
 * This interface represents the API that a Feature offers to a Pod after it has been instantiated. For the
 * instantiation API, refer to [[FeatureConstructor]].
 *
 * After the Feature has been instantiated according to [[FeatureConstructor]], the Pod will call the [[init]] method
 * to provide the [[Pod]] API to the Feature. At this point, the Feature has full control over the (asynchronous)
 * control flow and may perform arbitrary computations, including side effects. This notwithstanding, the Pod may still
 * (e.g. by user's request) cancel Feature execution by external means, such as killing the process the Feature runs in.
 *
 */
export interface Feature {
    /**
     * Yields control flow to the Feature.
     *
     * This method is only called once. The Pod assumes nothing about when this method will return, but it will `await`
     * the resulting promise. If the promise completes, the Feature is assumed to be terminated. If a new Feature run
     * is requested by the user, the Pod will re-bootstrap it; i.e., neither [[FeatureConstructor]] nor [[Feature]]
     * instances are re-used.
     *
     * As soon as this method is called, the Feature can start making the following assumptions about the runtime
     * environment:
     *
     * 1. the Pod API is initialized and responds to requests
     * 2. the Feature is being executed in a DOM environment (browser, iframe, [JSDOM](https://github.com/jsdom/jsdom/), ...)
     * 3. there is a DOM element with the id `feature` in which the Feature may render arbitrary content
     *
     * Features _may_ use arbitrary browser APIs for manipulating DOM nodes, including events. They _must not_ use other
     * APIs, including `fetch` or storage such as IndexedDB. Pod implementations _may_ impose additional restrictions.
     * Those restriction can be syntactic (e.g. forbidding an API) or semantic (e.g. demanding the use of a particular
     * set of styles).
     *
     * Interaction with the outside world can be done through the [[Pod]] API. In particular, HTTP requests can be done
     * with [[PolyOut]]. Note that the built-in HTTP querying methods of the browser are reserved for use from the Pod.
     *
     * @param pod The implementation of the [[Pod]] API that is exclusively used by this Feature
     */
    init(pod: Pod): Promise<void>;
}

/**
 * This interface represents the API that a Feature offers to a Pod to be instantiated. For the instance API, refer to
 * [[Feature]].
 *
 * A Feature resides in a self-contained JavaScript file. This file _should_ be in the following shape:
 *
 * ```
 * // arbitrary code
 * const Feature = class {
 *     // ...
 * }
 * ```
 *
 * or alternatively in IIFE form:
 *
 * ```
 * const Feature = (() => {
 *     // ...
 * })();
 * ```
 *
 * Evaluating this file _must_ result in the `Feature` identifier being bound to a class (or constructor function) that
 * satisfies this interface, i.e., construct an object with no arguments. Pods will instantiate the feature as follows:
 *
 * ```
 * const instance = new Feature();
 * ```
 *
 * Evaluating the feature file _should_ not carry out any computation. Invoking the constructor _should_ only perform
 * synchronous operations. When the constructor completes and returns an object, the Pod assumes that the Feature has
 * been successfully instantiated. It is not guaranteed that any system resources are present until this point. More
 * complex computation, such as rendering content or interacting with the [[Pod]] API happens later (see
 * [[Feature.init]] for details). Both this phase and the later initialization with the Pod API is referred to as
 * _bootstrapping_.
 *
 * At any point during bootstrappping, Pods _may_ inject their own code into Feature, for example to override certain
 * browser APIs.
 *
 * The runtime in which the Pod evaluates the Feature script file does not provide any module-specific environment such
 * as `module.exports`, nor module-specific syntax like `import` or `export`. Attempting to load more JavaScript code
 * is undefined behaviour and may lead to failure to bootstrap the Feature.
 */
export interface FeatureConstructor {
    /**
     * A constructor without arguments. The constructor should only be used to perform static initialization of
     * properties.
     *
     * This constructor is only called once. For subsequent Feature runs, the Feature script file is re-evaluated.
     */
    new(): Feature;
}
