import { DataFactory } from "rdf-js";
import { Endpoint, Info, PolyIn, PolyNav, PolyOut, Triplestore } from ".";

declare global {
    interface Window {
        pod: Pod;
    }
}

/**
 * This interface represents the API that a Pod offers to a Feature. It comprises multiple sub-components that are
 * concerned with different aspects. Those sub-components are grouped according to data flow (see member documentation
 * for details).
 *
 * Pod implementors may use any technology they see fit to provide the API, including remote procedure calls or HTTP
 * requests, as long as that is transparent to the Features. To that extent, the API is designed to be asynchronous,
 * i.e. all methods return promises. The only exception is the RDF data factory; see [[Pod.dataFactory]] for details.
 *
 * The API is provided to the Feature as a global variable (`window.pod`). The API is initialized eagerly. The Feature
 * is required to include a `script` tag referencing a well-known path to a JavaScript file in order
 * for the API to be bootstrapped properly:
 *
 * ```html
 * <script src="/pod.js"></script>
 * ```
 *
 * The Feature should load this script file before any custom code is executed. Otherwise, the
 * presence of the `window.pod` object is not guaranteed. It should be noted that asynchronous calls
 * to the Pod APIs may only be resolved when the `load` event of the document has triggered.
 *
 * This notwithstanding, Features may carry out custom initialization logic that does not depend on
 * the API concurrently.
 */
export interface Pod {
    /**
     * A [spec-compliant](http://rdf.js.org/data-model-spec/) data factory that is _not_ guaranteed to support variables.
     *
     * Example:
     * ```
     * const quad = factory.quad(
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
    readonly dataFactory: DataFactory;

    /**
     * `polyIn` is the interface to interact with the Pod store. Refer to [[PolyIn]] for its definition.
     */
    readonly polyIn: PolyIn;

    /**
     * `polyOut` is the interface to interact with the outside world. Refer to [[PolyOut]] for its definition.
     */
    readonly polyOut: PolyOut;

    /**
     * `polyNav` is the interface to interact the container. Refer to [[PolyNav]] for its definition.
     */
    readonly polyNav: PolyNav;

    /**
     * `info` is the interface to read information about the polyPod instance.
     */
    readonly info: Info;

    /**
     * `endpoint` is the interface to interact with other devices over the network via the pod. Refer to [[Endpoint]] for its
     * definition.
     */
    readonly endpoint: Endpoint;

    /**
     * `triplestore` is an interface to interact with the SPARQL-RDF database
     */
    readonly triplestore: Triplestore;
}
