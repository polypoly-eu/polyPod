/**
 * This module defines the protocol used for translating function calls into bare objects. Users rarely need to use this
 * module directly.
 *
 * The [[endpointClient]] and [[endpointServer]] functions speak a simple protocol:
 *
 * - each call is represented as an [[EndpointRequestPart]]
 * - a chain of calls is represented as an [[EndpointRequest]]
 * - a response is any kind of value ([[EndpointResponse]])
 *
 * @packageDocumentation
 */

/**
 * A function call representing the name of a method (of type string) and an array of arguments (of any type).
 */
export interface EndpointRequestPart {
    readonly method: string;
    readonly args: ReadonlyArray<any>;
}

/**
 * A request comprising a chain of function calls.
 */
export type EndpointRequest = EndpointRequestPart[];

/**
 * A response representing the return value of a function call.
 */
export type EndpointResponse = any;

/**
 * Function type representing the protocol: [[EndpointRequest]] comes in, [[EndpointResponse]] goes out.
 */
export type EndpointProcedure = (req: EndpointRequest) => Promise<EndpointResponse>;
