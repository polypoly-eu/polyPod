import {EndpointSpec, ServerOf, ClientOf} from "./types";
import {EndpointProcedure, EndpointRequestPart, EndpointError, EndpointResponse, EndpointRequest} from "./protocol";

export function endpointServer<Spec extends EndpointSpec>(impl: ServerOf<Spec>): EndpointProcedure {
    async function process(impl: any, parts: ReadonlyArray<EndpointRequestPart>): Promise<any> {
        if (parts.length === 0)
            return impl;

        const [{method, args}, ...rest] = parts;

        const f = impl[method];
        if (typeof f !== "function")
            return Promise.reject(new EndpointError(method));

        return process(await Promise.resolve(f.call(impl, ...args)), rest);
    }

    return req => process(impl, req.parts).then(res => new EndpointResponse(res));
}

function requestBuilder(client: EndpointProcedure, state: ReadonlyArray<EndpointRequestPart>): any {
    return new Proxy(new Function(), {
        apply(target, thisArg, argArray): Promise<any> {
            if (!Array.isArray(argArray) || argArray.length !== 0)
                throw new Error("Argument list must be empty");

            // end of line, make the call
            return client(new EndpointRequest(state)).then(res => res.value);
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
    return requestBuilder(client, []);
}
