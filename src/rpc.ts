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

class RequestBuilder {
    constructor(
        private readonly client: EndpointProcedure,
        private readonly state: ReadonlyArray<EndpointRequestPart>
    ) {}

    get get(): Promise<any> {
        return this.client(new EndpointRequest(this.state)).then(res => res.value);
    }

    get call(): any {
        const {client, state}  = this;
        return new Proxy({}, {
            get(target, property): (...args: any[]) => any {
                if (typeof property !== "string")
                    throw new Error(`Property ${String(property)} is not a string`);
                return (...args: any[]) =>
                    new RequestBuilder(client, [...state, { method: property, args: args }]);
            }
        })
    }
}

export function endpointClient<Spec extends EndpointSpec>(client: EndpointProcedure): ClientOf<Spec> {
    return new RequestBuilder(client, []) as any;
}
