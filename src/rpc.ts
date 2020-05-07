import {EndpointSpec, ServerOf, ClientOf, Callable} from "./types";
import {EndpointProcedure, EndpointRequestPart, EndpointRequest} from "./protocol";

export function endpointServer<Spec extends EndpointSpec>(impl: ServerOf<Spec>): EndpointProcedure {
    async function process(impl: any, parts: ReadonlyArray<EndpointRequestPart>): Promise<any> {
        if (parts.length === 0)
            return impl;

        const [{method, args}, ...rest] = parts;

        const f = impl[method];
        if (typeof f !== "function")
            return Promise.reject(new Error(`${method} is not a function`));

        return process(await Promise.resolve(f.call(impl, ...args)), rest);
    }

    return req => process(impl, req);
}

type RequestBuilder = Callable<any> & Record<string, (...args: any[]) => RequestBuilder>;

function requestBuilder(client: EndpointProcedure, state: EndpointRequest): RequestBuilder {
    return new Proxy<RequestBuilder>(new Function() as RequestBuilder, {
        apply(target, thisArg, argArray): Promise<any> {
            if (!Array.isArray(argArray) || argArray.length !== 0)
                throw new Error("Argument list must be empty");

            // end of line, make the call
            return client(state);
        },
        get(target, property): (...args: any[]) => any {
            if (typeof property !== "string")
                throw new Error(`Property ${String(property)} is not a string`);

            // nested call: return a callable function
            return (...args: any[]) =>
                requestBuilder(client, [...state, { method: property, args: args }]);
        }
    });
}

export function endpointClient<Spec extends EndpointSpec>(client: EndpointProcedure): ClientOf<Spec> {
    return requestBuilder(client, []) as ClientOf<Spec>;
}
