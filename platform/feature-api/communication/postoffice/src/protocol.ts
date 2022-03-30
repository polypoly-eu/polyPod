/**
 * This module defines the protocol used for translating function calls into bare objects. Users rarely need to use this
 * module directly.
 *
 * The [[backendClient]] and [[backendServer]] functions speak a simple protocol:
 *
 * - each call is represented as a [[BackendRequestPart]]
 * - a chain of calls is represented as a [[BackendRequest]]
 * - a response is any kind of value ([[BackendResponse]])
 *
 * @packageDocumentation
 */

/**
 * A function call representing the name of a method (of type string) and an array of arguments (of any type).
 */
export interface BackendRequestPart {
    readonly method: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly args: ReadonlyArray<any>;
}

/**
 * A request comprising a chain of function calls.
 */
export type BackendRequest = BackendRequestPart[];

/**
 * A response representing the return value of a function call.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BackendResponse = any;

/**
 * Function type representing the protocol: [[BackendRequest]] comes in, [[BackendResponse]] goes out.
 */
export type BackendProcedure = (req: BackendRequest) => Promise<BackendResponse>;
