/**
 * This module implements the mapping of function calls on a proxy to the
 * underlying protocol ([[BackendProcedure]]), and back to function calls on
 * the real object.
 *
 * Servers can use [[backendServer]] to turn the implementation of a backend endpoint
 * specification ([[ServerOf]]) into a plain function. Clients can use
 * [[backendClient]] to turn a plain function into a proxy object
 * ([[ClientOf]]).
 *
 * In the simplest case, [[backendServer]] and [[backendClient]] can be
 * composed as follows:
 *
 * ```
 * const rpcClient: ClientOf<Spec> = backendClient(backendServer(specImpl));
 * ```
 *
 * This is a “loopback” connection where both client and server reside in the
 * same context.
 *
 * In a real-world setting, client and server are located in different
 * processes. This library integrates seamlessly with
 * [port-authority](https://github.com/polypoly-eu/polyPod/tree/main/core/communication/port-authority).
 * Endpoint clients and servers can be constructed from any port:
 *
 * ```
 * import {client, server} from "@polypoly-eu/communication";
 *
 * declare serverPort: ResponsePort<EndpointRequest, EndpointResponse>;
 *
 * server(serverPort, backendServer(specImpl));
 *
 * declare clientPort: RequestPort<BackendRequest, BackendResponse>;
 *
 * const rpcClient: ClientOf<Spec> = backendClient(client(clientPort));
 * ```
 *
 * @packageDocumentation
 */

import { BackendSpec, ServerOf, ClientOf, Callable } from "./types";
import {
    BackendProcedure,
    BackendRequestPart,
    BackendRequest,
} from "./protocol";

/**
 * It turns a backend endpoint specification implementation into a backend plain procedure.
 * @param {ServerOf<Spec>} impl - The implementation of the backend.
 * @returns {BackendProcedure} - A function that takes a request and returns a promise of a response.
 */
export function backendServer<Spec extends BackendSpec>(
    impl: ServerOf<Spec>
): BackendProcedure {
    async function process(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        impl: any,
        parts: ReadonlyArray<BackendRequestPart>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        if (parts.length === 0) return impl;

        const [{ method, args }, ...rest] = parts;

        const f = impl[method];
        if (typeof f !== "function")
            return Promise.reject(new Error(`${method} is not a function`));

        return process(await Promise.resolve(f.call(impl, ...args)), rest);
    }

    return (req) => process(impl, req);
}

/**
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RequestBuilder = Callable<any> &
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, (...args: any[]) => RequestBuilder>;

/**
 * @hidden
 * It returns a proxy object that, when called, calls the client function with the current state
 * @param {BackendProcedure} client - BackendProcedure
 * @param {BackendRequest} state - BackendRequest
 * @returns A proxy object that is a function that returns a promise.
 */
function requestBuilder(
    client: BackendProcedure,
    state: BackendRequest
): RequestBuilder {
    return new Proxy<RequestBuilder>(new Function() as RequestBuilder, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apply(target, thisArg, argArray): Promise<any> {
            if (!Array.isArray(argArray) || argArray.length !== 0)
                throw new Error("Argument list must be empty");

            // end of line, make the call
            return client(state);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get(target, property): (...args: any[]) => any {
            if (typeof property !== "string")
                throw new Error(`Property ${String(property)} is not a string`);

            // nested call: return a callable function
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (...args: any[]) =>
                requestBuilder(client, [
                    ...state,
                    { method: property, args: args },
                ]);
        },
    });
}

/**
 * It takes a client [[BackendProcedure]] and returns a proxy client object
 * that turns a function call chain into a plain function call.
 * @param {BackendProcedure} client - The backend procedure that will be called.
 * @returns {ClientOf<Spec>} - A function that takes a spec and returns a client.
 */
export function backendClient<Spec extends BackendSpec>(
    client: BackendProcedure
): ClientOf<Spec> {
    return requestBuilder(client, []) as ClientOf<Spec>;
}
