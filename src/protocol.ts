import {deserialize, serialize, Classes} from "@polypoly-eu/bubblewrap";
import {Procedure} from "@polypoly-eu/port-authority";

export interface EndpointRequestPart {
    readonly method: string;
    readonly args: ReadonlyArray<any>;
}

export type EndpointRequest = EndpointRequestPart[];
export type EndpointResponse = any;

export type EndpointProcedure = Procedure<EndpointRequest, EndpointResponse>
