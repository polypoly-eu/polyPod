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

export interface EndpointRequestPart {
    readonly method: string;
    readonly args: ReadonlyArray<any>;
}

export type EndpointRequest = EndpointRequestPart[];
export type EndpointResponse = any;

export type EndpointProcedure = (req: EndpointRequest) => Promise<EndpointResponse>;
