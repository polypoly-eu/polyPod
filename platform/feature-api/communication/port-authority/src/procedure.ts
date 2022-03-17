/**
 * This module specifies the higher-level port abstractions and combinators. The main types are [[ResponsePort]],
 * [[RequestPort]], and [[Procedure]].
 *
 * Since raw [[Port]]s are unstructured communication abstractions, this module layers an additional abstraction on top
 * that allows structured request-response cycles.
 *
 * Throughout this module, the convention is to use `Req` and `Res` type parameters to mean the type of requests and
 * responses.
 *
 * @packageDocumentation
 */

import { Handler, Port, ReceiverPort, TxPort } from "./port";

/**
 * A pair of `resolve` and `reject` callbacks that resolve an underlying `Promise`.
 *
 * When creating a `Promise` through the `new Promise(executor)` constructor, the `executor` parameter is a function
 * that takes precisely this pair of functions as an argument. Consequently, an instance of `PromiseResolvers` can be
 * created as follows:
 *
 * ```
 * let resolvers: PromiseResolvers<Res>;
 * const response = new Promise<Res>((resolve, reject) => {
 *   resolvers = { resolve, reject };
 * });
 *
 * // pass `resolvers` somewhere else
 * // ...
 *
 * // when `resolvers.resolve` or `resolvers.reject` is called, a message is printed:
 * console.log(await response);
 * ```
 *
 * Note that the above snippet works because the executor passed to the `new Promise` constructor is executed
 * synchronously.
 *
 * The semantics of the callbacks is identical to the
 * [Promise specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 */
export interface PromiseResolvers<Res> {
    resolve(t: Res | Promise<Res>): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject(err?: any): void;
}

/**
 * This interface represents an arbitrary object with an attached [[PromiseResolvers]] callback pair. The intended
 * semantics is that the object is a _request_ and that the response is set through the callbacks.
 */
export interface WithResolvers<Req, Res> {
    request: Req;
    resolvers: PromiseResolvers<Res>;
}

/**
 * A _response port_ is a [[ReceiverPort]] for receiving messages with attached [[PromiseResolvers]]. The intended
 * semantics is that this represents a _server_ that listens for requests and responds using the callbacks.
 */
export type ResponsePort<Req, Res> = ReceiverPort<WithResolvers<Req, Res>>;

/**
 * A _request port_ is a [[SendPort]] for sending messages with attached [[PromiseResolvers]]. The intended
 * semantics is that this represents a _client_ that sends requests and additionally passes callbacks to the server
 * for the response.
 */
export type RequestPort<Req, Res> = TxPort<WithResolvers<Req, Res>>;

/**
 * A _procedure_ is any function that asynchronously maps a request to a response.
 */
export type Procedure<Req, Res> = (req: Req) => Promise<Res>;

/**
 * Turns a [[RequestPort]] into a [[Procedure]].
 *
 * This function creates a new `Promise` for each request and uses the constructs the callbacks as described in
 * [[PromiseResolvers]].
 *
 * Example usage:
 *
 * ```
 * declare const clientPort: RequestPort<string, string>;
 * const clientProc: Procedure<string, string> = client(clientPort);
 *
 * console.dir(await clientProc("world"));
 * ```
 *
 * @param port the port used to send messages
 * @returns a function that can be used to transparently send messages over a [[RequestPort]] and await the response
 */
export function client<Req, Res>(port: RequestPort<Req, Res>): Procedure<Req, Res> {
    return (req) =>
        new Promise<Res>((resolve, reject) => {
            port.send({
                request: req,
                resolvers: { resolve, reject },
            });
        });
}

/**
 * Add a [[Procedure]] as a handler to a [[ResponsePort]].
 *
 * This function uses [[ReceiverPort.addHandler]] to add a new handler to the given [[ResponsePort]]. Upon receiving a
 * message, the given procedure is executed. If the procedure succeeds, the [[PromiseResolvers.resolve]] callback is
 * invoked. If the procedure fails, the [[PromiseResolvers.reject]] callback is invoked.
 *
 * Example usage:
 *
 * ```
 * declare const serverPort: ResponsePort<string, string>;
 * const serverProc: Procedure<string, string> = async (req: string) => {
 *     console.log(req);
 *     return `Hello ${req}`;
 * }
 *
 * server(serverPort, serverProc);
 * ```
 *
 * @param port the port to which the handler is added
 * @param procedure the function that is called for each incoming message
 */
export function server<Req, Res>(
    port: ResponsePort<Req, Res>,
    procedure: Procedure<Req, Res>
): void {
    port.addHandler(async (request) => {
        try {
            const response = await procedure(request.request);
            request.resolvers.resolve(response);
        } catch (err) {
            request.resolvers.reject(err);
        }
    });
}

/**
 * A simple wrapper around requests with an associated request identifier.
 */
export interface ClientRequest<Req> {
    request: Req;
    id: number;
}

/**
 * Responses that may be successful or failed with an associated request identifier.
 */
export type ServerResponse<Res> = { id: number; response: Res } | { id: number; error: unknown };

/**
 * Lifts a raw [[Port]] that supports sending identified requests and receiving identified responses to a
 * [[RequestPort]].
 *
 * In order to enable structured request-response communication on an unstructured [[Port]], this function communicates
 * through identified requests. The resulting [[RequestPort]] performs the following steps when sending a message:
 *
 * 1. the request gets assigned an increasing numeric identifier
 * 2. the [[PromiseResolvers]] are stored in an internal map
 * 3. when a response is received, the appropriate resolver is looked up from the map and resolved or rejected
 *    accordingly
 *
 * No callbacks are sent through the raw port. The resulting [[RequestPort]] acts as a request-response façade for the
 * raw port.
 *
 * Example usage:
 *
 * ```
 * declare const nodePort: MessagePort;
 * const rawPort: Port<any, any> = fromNodeMessagePort(nodePort);
 * const clientPort: RequestPort<string, string> = liftClient(rawPort);
 *
 * clientPort.send({
 *     request: "world",
 *     resolvers: {
 *         resolve: res => console.dir(await res),
 *         reject: err => console.log(`oh noes: ${err}`)
 *     }
 * });
 * ```
 *
 * Internally, the client port translates this to the following call:
 *
 * ```
 * rawPort.send({
 *     id: 42,
 *     request: "world"
 * });
 * ```
 */
export function liftClient<Req, Res>(
    port: Port<ServerResponse<Res>, ClientRequest<Req>>
): RequestPort<Req, Res> {
    let id = 0;
    const pending = new Map<number, PromiseResolvers<Res>>();
    port.addHandler((response) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { resolve, reject } = pending.get(response.id)!;
        if ("error" in response) reject(response.error);
        else resolve(response.response);
    });

    return {
        send: (req) => {
            const currentId = ++id;
            pending.set(currentId, req.resolvers);
            port.send({
                request: req.request,
                id: currentId,
            });
        },
    };
}

/**
 * Lifts a raw [[Port]] that supports receiving identified requests and sending identified responses to a
 * [[ResponsePort]].
 *
 * In order to enable structured request-response communication on an unstructured [[Port]], this function communicates
 * through identified requests. The resulting [[ResponsePort]] performs the following steps when receiving a message:
 *
 * 1. extract the numeric request identifier
 * 2. create new [[PromiseResolvers]] callbacks and sends them together with the request to the first handler that
 *    has been registered
 * 3. when the callback is resolved, send the response on the raw port together with the original request identifier
 *
 * No callbacks are sent through the raw port. The resulting [[ResponsePort]] acts as a request-response façade for the
 * raw port.
 *
 * Example usage:
 *
 * ```
 * declare const nodePort: MessagePort;
 * const rawPort: Port<any, any> = fromNodeMessagePort(nodePort);
 * const serverPort: ResponsePort<string, string> = liftServer(rawPort);
 *
 * serverPort.addHandler(({ request, { resolve, reject }}) => {
 *   console.log(request);
 *   resolve(`Hello ${request}`);
 * });
 * ```
 *
 * The resulting [[ResponsePort]] only calls the first handler that has been added, because multiple servers handling
 * the same requests is generally ill-defined.
 */
export function liftServer<Req, Res>(
    port: Port<ClientRequest<Req>, ServerResponse<Res>>
): ResponsePort<Req, Res> {
    let handler: Handler<WithResolvers<Req, Res>> | undefined = undefined;

    port.addHandler(async (request) => {
        const h = handler;
        if (!h) return;

        try {
            const response = await new Promise<Res>((resolve, reject) => {
                h({
                    request: request.request,
                    resolvers: { resolve, reject },
                });
            });
            port.send({
                id: request.id,
                response,
            });
        } catch (err) {
            port.send({
                id: request.id,
                error: err,
            });
        }
    });

    return {
        addHandler: (h) => {
            if (!handler) handler = h;
        },
    };
}
