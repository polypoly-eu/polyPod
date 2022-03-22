/**
 * Universal implementation of [[RequestPort]]s based on the Fetch API. All functions take an arbitrary Fetch
 * implementation; users may specify `window.fetch` in a browser context or a polyfill on Node.js.
 *
 * @packageDocumentation
 */

import { RequestPort } from "./procedure";
import { mapSendPort } from "./port";
import { Bubblewrap } from "@polypoly-eu/communication";
import { rethrowPromise, Try } from "./util";

/**
 * Uses a [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) implementation to
 * implement a [[RequestPort]] that transmits messages via HTTP POST requests.
 *
 * The request type is fixed to `BodyInit` as defined by the DOM specification. Possible values include `Blob` or
 * `BufferSource`. Users have to convert their own data accordingly before sending down the resulting [[RequestPort]].
 * See [[jsonFetchPort]] and [[bubblewrapFetchPort]] for convenience wrappers that handle conversions.
 *
 * Upon receiving a request, the resulting [[RequestPort]] performs the following steps:
 *
 * 1. extract the request from the [[PromiseResolvers]]
 * 2. send a POST request to the specified URL with the given content type and request body
 * 3. parse the HTTP response by calling the `parse` function
 * 4. invoke the [[PromiseResolvers]] callbacks with the result of parsing
 *
 * Note that it is assumed that the HTTP response has status code 200. Otherwise, an error will be signalled by
 * calling the `reject` callback. Both server and client need to agree on a suitable application-level protocol how to
 * map errors into a response body and back from it. The default server ([[routerPort]]) requires a format function that
 * should be an inverse to `parse`.
 *
 * @param url the URL used for all requests
 * @param contentType the HTTP content type of the request
 * @param parse a function that consumes the response body and returns a successful or failed promise
 * @param fetch the Fetch implementation; `window.fetch` can be used in the browser and a polyfill on Node.js
 */
export function fetchPort<T>(
    url: string,
    contentType: string,
    parse: (body: Body) => Promise<T>,
    fetch: typeof window.fetch
): RequestPort<BodyInit, T> {
    return {
        send: async (request) => {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": contentType,
                },
                method: "post",
                body: request.request,
            });

            if (!response.ok) {
                request.resolvers.reject(new Error("Invalid response code"));
                return;
            }

            try {
                const parsed = await parse(response);
                request.resolvers.resolve(parsed);
            } catch (err) {
                request.resolvers.reject(err);
            }
        },
    };
}

/**
 * Wrapper around [[fetchPort]] set up for JSON communication. The content type is set to `application/json`.
 *
 * This wrapper follows the same error protocol as [[jsonRouterPort]]. Outgoing requests are transformed into strings
 * using `JSON.stringify`. Conversely, incoming responses are parsed using `JSON.parse`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonFetchPort(url: string, fetch: typeof window.fetch): RequestPort<any, any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawPort = fetchPort<any>(
        url,
        "application/json",
        async (body) => rethrowPromise(await body.json()),
        fetch
    );

    return mapSendPort(rawPort, (data) => ({
        resolvers: data.resolvers,
        request: JSON.stringify(data.request),
    }));
}

/**
 * Wrapper around [[fetchPort]] set up for raw byte stream communication. The content type is set to
 * `application/octet-stream`.
 *
 * This wrapper follows the same error protocol as [[bubblewrapRouterPort]]. Outgoing requests are encoded into byte
 * stream using Bubblewrap. Conversely, incoming responses are decoded using Bubblewrap.
 */
export function bubblewrapFetchPort(
    url: string,
    bubblewrap: Bubblewrap,
    fetch: typeof window.fetch
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): RequestPort<any, any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawPort = fetchPort<any>(
        url,
        "application/octet-stream",
        async (body) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decoded: Try<any> = bubblewrap.decode(new Uint8Array(await body.arrayBuffer()));
            if (decoded.tag === "failure") throw decoded.err;
            else return decoded.value;
        },
        fetch
    );

    return mapSendPort(rawPort, (data) => ({
        resolvers: data.resolvers,
        request: bubblewrap.encode(data.request),
    }));
}
