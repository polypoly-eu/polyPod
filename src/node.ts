/**
 * Node-specific implementations of [[Port]] and [[ResponsePort]].
 *
 * @packageDocumentation
 */

import {Handler, mapReceivePort, Port} from "./port";
import {MessagePort} from "worker_threads";
import {ResponsePort} from "./procedure";
import {Router} from "express";
import {recoverPromise, Try} from "./util";
import {OptionsJson, Options} from "body-parser";
import {Bubblewrap} from "@polypoly-eu/bubblewrap";
import {json, raw} from "body-parser";

/**
 * Converts a Node `MessagePort` into a raw [[Port]] with unknown types.
 *
 * The [[SendPort.send]] and [[ReceivePort.addHandler]] methods delegate directly to the underlying Node implementation.
 * For typed operation, it is recommended to use [[mapPort]] with type coercions.
 *
 * It is not possible to transfer objects with this [[Port]].
 *
 * Note that Node `MessagePort`s constructed from `MessageChannel` use a variant of the structured clone algorithm; that
 * is, an object sent on the port will be received as a different object.
 */
export function fromNodeMessagePort(port: MessagePort): Port<any, any> {
    return {
        send(value: any): void {
            port.postMessage(value);
        },
        addHandler(handler: Handler<any>): void {
            port.on("message", handler);
        }
    };
}

/**
 * Given an [Express Router](https://expressjs.com/en/4x/api.html#router), register a `POST` route on the `/` path that
 * acts as a [[ResponsePort]] for reading some `POST` body and responds with an arbitrary object.
 *
 * The request type can be chosen freely by users. It must be a request type that is understood by Express. Ensure that
 * [body-parser](https://www.npmjs.com/package/body-parser) middleware or similar middleware is set up for the
 * appropriate content type in the router. Otherwise, handlers will receive an empty or ill-typed body. See
 * [[jsonRouterPort]] and [[bubblewrapRouterPort]] for convenience wrappers that handle conversions.
 *
 * Upon receiving a POST request, the resulting [[ResponsePort]] performs the following steps:
 *
 * 1. extract the body from the request
 * 2. create new [[PromiseResolvers]] callbacks and sends them together with the body to the first handler that has been
 *    registered
 * 3. when the callback is resolved, call the `format` function with a [[Success]] or [[Failure]] value
 * 4. send the formatted result with the specified content type as a HTTP 200 response
 *
 * Note that HTTP clients will always receive a 200 response. Both server and client need to agree on a suitable
 * application-level protocol how to map errors into a response body and back from it. The default client
 * ([[fetchPort]]) requires a parse function that should be an inverse to `format`.
 *
 * The resulting [[ResponsePort]] only calls the first handler that has been added. This mirrors the behaviour of
 * Express when multiple routes are added to a router. There is no notion of calling the Express' `next` function to
 * try another handler. This is similar to [[liftServer]].
 *
 * @param router the router to which the `POST` route handler will be added
 * @param contentType the HTTP content type of the response
 * @param format a function that converts a successful response or an error into a body; it should never throw
 */
export function routerPort<T, Body = any>(
    router: Router,
    contentType: string,
    format: (result: Try<T>) => Body
): ResponsePort<Body, T> {
    return {
        addHandler: handler => {
            router.post<any, Body, Body>("/", async (request, response) => {
                const result = await recoverPromise(new Promise<T>(((resolve, reject) => {
                    handler({
                        request: request.body,
                        resolvers: {resolve, reject}
                    });
                })));

                const body = format(result);

                response.contentType(contentType);
                response.writeHead(200);
                response.write(body);
                response.end();
            });
        }
    };
}

/**
 * Wrapper around [[routerPort]] set up for JSON communication. The content type is set to `application/json`.
 *
 * This wrapper follows the same error protocol as [[jsonFetchPort]]. The formatting uses `JSON.stringify` to convert
 * the [[Try]] representing the outcome of the promise to a string. Conversely, incoming requests are parsed using
 * `JSON.parse`.
 */
export function jsonRouterPort(
    router: Router,
    options?: OptionsJson
): ResponsePort<any, any> {
    const contentType = "application/json";

    router.use(json({
        ...options,
        strict: false,
        type: contentType
    }));

    return routerPort<any, any>(
        router,
        contentType,
        JSON.stringify
    );
}

/**
 * Wrapper around [[routerPort]] set up for raw byte stream communication. The content type is set to
 * `application/octet-stream`.
 *
 * This wrapper follows the same error protocol as [[bubblewrapFetchPort]]. The formatting uses standard Bubblewrap
 * encoding to convert the [[Try]] representing the outcome of the promise to a string. Conversely, incoming requests
 * are decoded using standard Bubblewrap decoding.
 */
export function bubblewrapRouterPort(
    router: Router,
    bubblewrap: Bubblewrap,
    options?: Options
): ResponsePort<any, any> {
    const contentType = "application/octet-stream";

    router.use(raw({
        ...options,
        type: contentType
    }));

    const rawPort = routerPort<any, Buffer>(
        router,
        contentType,
        value => Buffer.from(bubblewrap.encode(value))
    );

    return mapReceivePort(
        rawPort,
        data => ({
            resolvers: data.resolvers,
            request: bubblewrap.decode(data.request)
        })
    );
}