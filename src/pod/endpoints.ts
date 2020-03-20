import {ObjectEndpointSpec, ValueEndpointSpec} from "@polypoly-eu/postoffice";
import * as RDF from "rdf-js";
import {Matcher} from "@polypoly-eu/poly-api";

export type PolyInEndpoint = ObjectEndpointSpec<{
    select(matcher: Partial<Matcher>): ValueEndpointSpec<RDF.Quad[]>;
    add(...quads: RDF.Quad[]): ValueEndpointSpec<void>;
}>;

export type PolyOutEndpoint = ObjectEndpointSpec<{
    readFile(path: string, options: { encoding: BufferEncoding }): ValueEndpointSpec<string>;
    httpRequest(url: string, method: string, body?: string, headers?: Record<string, string>): ValueEndpointSpec<string>;
}>;

export type PodEndpoint = ObjectEndpointSpec<{
    polyIn(): PolyInEndpoint;
    polyOut(): PolyOutEndpoint;
}>;
