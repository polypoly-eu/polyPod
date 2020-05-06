export type EndpointType = "value" | "object";

export interface BaseEndpointSpec {
    endpointType: EndpointType;
}

export interface ValueEndpointSpec<T> extends BaseEndpointSpec {
    endpointType: "value";
    value: T;
}

export interface ObjectEndpointSpec<T extends Record<string, (...args: any[]) => EndpointSpec>> extends BaseEndpointSpec {
    endpointType: "object";
    methods: T;
}

export type EndpointSpec = ValueEndpointSpec<any> | ObjectEndpointSpec<any>;

export type ForcePromise<T> =
    T extends Promise<any> ?
        T :
        Promise<T>;

export type MaybePromise<T> = T | ForcePromise<T>;

export type ServerOf<Spec extends EndpointSpec> =
    Spec extends ValueEndpointSpec<infer T> ?
        MaybePromise<T> :
        Spec extends ObjectEndpointSpec<infer T> ?
            {
                [P in keyof T]:
                    T[P] extends (...args: infer Args) => infer Return ?
                        (
                            Return extends EndpointSpec ?
                                (...args: Args) => MaybePromise<ServerOf<Return>>:
                                never
                        ) :
                        never
            } :
            never;

export type ClientOf<Spec extends EndpointSpec> =
    Spec extends ValueEndpointSpec<infer T> ?
        () => ForcePromise<T> :
        Spec extends ObjectEndpointSpec<infer T> ?
            {
                [P in keyof T]:
                    T[P] extends (...args: infer Args) => infer Return ?
                        (
                            Return extends EndpointSpec ?
                                (...args: Args) => ClientOf<Return> :
                                never
                        ) :
                       never
            } :
            never;
