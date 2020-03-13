import {ReqRes} from "./ports";
import {bubblewrap, builtin, Typeson} from "@polypoly-eu/bubblewrap";

export type EndpointType = "value" | "object";

export interface BaseEndpointSpec {
    endpointType: EndpointType;
}

export interface ValueEndpointSpec<T>  extends BaseEndpointSpec {
    endpointType: "value";
}

export interface ObjectEndpointSpec<T extends Record<string, (...args: any[]) => EndpointSpec>> extends BaseEndpointSpec {
    endpointType: "object";
    methods: T;
}

export type EndpointSpec = ValueEndpointSpec<any> | ObjectEndpointSpec<any>;

export type ServerOf<Spec extends EndpointSpec> =
    Spec extends ValueEndpointSpec<infer T> ?
        (T | Promise<T>) :
        Spec extends ObjectEndpointSpec<infer T> ?
            {
                [P in keyof T]:
                    T[P] extends (...args: infer Args) => infer Return ?
                        (
                            Return extends EndpointSpec ?
                                (...args: Args) => (ServerOf<Return> | Promise<ServerOf<Return>>):
                                never
                        ) :
                        never
            } :
            never;

export type ClientOf<Spec extends EndpointSpec> =
    Spec extends ValueEndpointSpec<infer T> ?
        { get: Promise<T> } :
        Spec extends ObjectEndpointSpec<infer T> ?
            {
                call:
                    {
                        [P in keyof T]:
                        T[P] extends (...args: infer Args) => infer Return ?
                            (
                                Return extends EndpointSpec ?
                                    (...args: Args) => ClientOf<Return> :
                                    never
                                ) :
                            never
                    };
            }:
            never;

export interface EndpointRequestPart {
    readonly method: string;
    readonly args: ReadonlyArray<any>;
}

export class EndpointRequest {
    constructor(
        readonly parts: ReadonlyArray<EndpointRequestPart>
    ) {}
}

export class EndpointResponse {
    constructor(
        public readonly value: any
    ) {}
}

export class EndpointError extends Error {
    constructor(
        public readonly method: string
    ) {
        super(`Method not found: ${method}`);
    }
}

export type EndpointReqRes = ReqRes<EndpointRequest, EndpointResponse>

export const typesonHandlers = bubblewrap(
    "eu.polypoly.postoffice.rpc",
    EndpointError,
    EndpointRequest,
    EndpointResponse
);

export const endpointTypeson: Typeson = new Typeson()
    .register(typesonHandlers)
    .register(builtin);

export function endpointServer<Spec extends EndpointSpec>(impl: ServerOf<Spec>): EndpointReqRes {
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
        private readonly client: EndpointReqRes,
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

export function endpointClient<Spec extends EndpointSpec>(client: EndpointReqRes): ClientOf<Spec> {
    return new RequestBuilder(client, []) as any;
}