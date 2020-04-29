import {deserialize, serialize, Classes} from "@polypoly-eu/bubblewrap";
import {Procedure} from "@polypoly-eu/port-authority";

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

    static [deserialize](method: string): EndpointError {
        return new EndpointError(method);
    }

    [serialize](): string {
        return this.method;
    }
}

export type EndpointProcedure = Procedure<EndpointRequest, EndpointResponse>

export const endpointBubblewrapClasses: Classes = {
    "@polypoly-eu/postoffice.rpc.EndpointError": EndpointError,
    "@polypoly-eu/postoffice.rpc.EndpointRequest": EndpointRequest,
    "@polypoly-eu/postoffice.rpc.EndpointResponse": EndpointResponse
};
