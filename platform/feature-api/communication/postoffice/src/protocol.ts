/**
 * This module defines the protocol used for translating function calls into bare objects. Users rarely need to use this
 * module directly.
 *
 * The [[backendEndpointClient]] and [[backendEndpointServer]] functions speak a simple protocol:
 *
 * - each call is represented as an [[BackendEndpointRequestPart]]
 * - a chain of calls is represented as an [[BackendEndpointRequest]]
 * - a response is any kind of value ([[BackendEndpointResponse]])
 *
 * @packageDocumentation
 */

/**
 * A function call representing the name of a method (of type string) and an array of arguments (of any type).
 */
export interface BackendEndpointRequestPart {
    readonly method: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly args: ReadonlyArray<any>;
}

/**
 * A request comprising a chain of function calls.
 */
export type BackendEndpointRequest = BackendEndpointRequestPart[];

/**
 * A response representing the return value of a function call.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BackendEndpointResponse = any;

/**
 * Function type representing the protocol: [[BackendEndpointRequest]] comes in, [[BackendEndpointResponse]] goes out.
 */
export type BackendEndpointProcedure = (
    req: BackendEndpointRequest
) => Promise<BackendEndpointResponse>;
