import {ObjectEndpointSpec, ValueEndpointSpec} from "@polypoly-eu/postoffice";
import {Matcher, Response, RequestInit, EncodingOptions} from "@polypoly-eu/poly-api";
import {Quad} from "rdf-js";
import * as RDF from "@polypoly-eu/rdf";
import {Classes} from "@polypoly-eu/bubblewrap";

export type PolyInEndpoint = ObjectEndpointSpec<{
    select(matcher: Partial<Matcher>): ValueEndpointSpec<Quad[]>;
    add(...quads: Quad[]): ValueEndpointSpec<void>;
}>;

export type PolyOutEndpoint = ObjectEndpointSpec<{
    readFile(path: string, options: EncodingOptions): ValueEndpointSpec<string>;
    writeFile(path: string, content: string, options: EncodingOptions): ValueEndpointSpec<void>;
    stat(path: string): ValueEndpointSpec<void>;
    fetch(input: string, init?: RequestInit): ValueEndpointSpec<Response>;
}>;

export type PodEndpoint = ObjectEndpointSpec<{
    polyIn(): PolyInEndpoint;
    polyOut(): PolyOutEndpoint;
}>;

export class FetchResponse implements Response {

    readonly ok: boolean;
    readonly redirected: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly type: ResponseType;
    readonly url: string;

    static async of(response: Response): Promise<FetchResponse> {
        return new FetchResponse(
            response,
            await response.text()
        );
    }

    constructor(
        response: Response,
        private readonly bufferedText: string
    ) {
        this.ok = response.ok;
        this.redirected = response.redirected;
        this.status = response.status;
        this.statusText = response.statusText;
        this.type = response.type;
        this.url = response.url;
    }

    async json(): Promise<any> {
        // JSON parse error must be asynchronous (i.e. rejected promise)
        return JSON.parse(this.bufferedText);
    }

    text(): Promise<string> {
        return Promise.resolve(this.bufferedText);
    }

}

export const podBubblewrapClasses: Classes = {
    "@polypoly-eu/podigree.FetchResponse": FetchResponse,
    "@polypoly-eu/rdf.NamedNode": RDF.NamedNode,
    "@polypoly-eu/rdf.BlankNode": RDF.BlankNode,
    "@polypoly-eu/rdf.Literal": RDF.Literal,
    "@polypoly-eu/rdf.Variable": RDF.Variable,
    "@polypoly-eu/rdf.DefaultGraph": RDF.DefaultGraph,
    "@polypoly-eu/rdf.Quad": RDF.Quad
};