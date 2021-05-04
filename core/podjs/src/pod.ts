import type { RequestInit, Response } from "@polypoly-eu/fetch-spec";
import type { Matcher, Pod, PolyIn, PolyOut } from "@polypoly-eu/poly-api";
import { EncodingOptions, Stats } from "@polypoly-eu/poly-api";
import { dataFactory } from "@polypoly-eu/rdf";
import * as RDF from "rdf-js";

class LocalStoragePolyIn implements PolyIn {
    private static readonly storageKey = "polyInStore";
    private store = JSON.parse(localStorage.getItem(LocalStoragePolyIn.storageKey) || "[]");

    async select(matcher: Partial<Matcher>): Promise<RDF.Quad[]> {
        return this.store;
    }

    async add(...quads: RDF.Quad[]): Promise<void> {
        this.store.push(...quads);
        localStorage.setItem(
            LocalStoragePolyIn.storageKey,
            JSON.stringify(this.store)
        );
    }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
class ThrowingPolyOut implements PolyOut {
    fetch(input: string, init?: RequestInit): Promise<Response> {
        throw "Not implemented: fetch";
    }

    readFile(path: string, options: EncodingOptions): Promise<string>;
    readFile(path: string): Promise<Uint8Array>;
    readFile(path: string, options?: EncodingOptions): Promise<string | Uint8Array> {
        throw "Not implemented: readFile";
    }

    readdir(path: string): Promise<string[]> {
        throw "Not implemented: readdir";
    }

    stat(path: string): Promise<Stats> {
        throw "Not implemented: stat";
    }

    writeFile(path: string, content: string, options: EncodingOptions): Promise<void> {
        throw "Not implemented: writeFile";
    }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

class BrowserPod implements Pod {
    public readonly dataFactory = dataFactory;
    public readonly polyIn = new LocalStoragePolyIn();
    public readonly polyOut = new ThrowingPolyOut();
}

window.pod = new BrowserPod();
