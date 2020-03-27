import * as RDF from "rdf-js";

export interface Matcher {
    subject: RDF.Quad_Subject;
    predicate: RDF.Quad_Predicate;
    object: RDF.Quad_Object;
}

export interface PolyIn {
    readonly factory: RDF.DataFactory;
    select(matcher: Partial<Matcher>): Promise<RDF.Quad[]>;
    add(...quads: RDF.Quad[]): Promise<void>;
}

export interface PolyOut {
    readFile(path: string, options: { encoding: BufferEncoding }): Promise<string>;

    // TODO migrate to fetch
    httpRequest(url: string, method: string, body?: string, headers?: Record<string, string>): Promise<string>;
}

export interface Pod {
    readonly polyIn: PolyIn;
    readonly polyOut: PolyOut;
}
