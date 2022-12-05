import { DataFactory } from "rdf-js";
import { Endpoint, Info, PolyIn, PolyNav, PolyOut, Triplestore } from ".";

/**
 * The polyPod API, exposed to Features as `window.pod`.
 *
 * It consists of multiple components that are concerned with different aspects.
 *
 * To use the API, a Feature needs to load the `pod.js` file provided by the
 * polyPod:
 *
 * ```html
 * <script src="pod.js"></script>
 * ```
 *
 * This makes the `window.pod` object available, which holds all the components
 * listed below. For example, to log the name of the polyPod runtime:
 *
 * ```js
 * console.log(await window.pod.info.getRuntime());
 * ```
 */
export interface Pod {
    /**
     * An implementation of RDF/JS' DataFactory used in conjunction with
     * [[PolyIn]].
     *
     * @see [[DataFactory]]
     */
    readonly dataFactory: DataFactory;

    /**
     * Offers access to the polyPod's internal triplestore.
     *
     * @see [[PolyIn]]
     */
    readonly polyIn: PolyIn;

    /**
     * Allows Features to store data on a virtual file system not accessible to
     * other Features.
     *
     * @see [[PolyOut]]
     */
    readonly polyOut: PolyOut;

    /**
     * Allows Features to interact with the user outside the confines of their
     * container.
     *
     * @see [[PolyNav]]
     */
    readonly polyNav: PolyNav;

    /**
     * Allows Features to read information about the polyPod instance they are
     * being executed in.
     *
     * @see [[Info]]
     */
    readonly info: Info;

    /**
     * Allows Features to exchange data with external servers.
     *
     * @see [[Endpoint]]
     */
    readonly endpoint: Endpoint;

    /**
     * An experimental replacement for [[PolyIn]].
     *
     * @experimental
     * @see [[Triplestore]]
     */
    readonly triplestore: Triplestore;
}

declare global {
    interface Window {
        pod: Pod;
    }
}
