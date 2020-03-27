import * as RDF from "rdf-js";
import {dataset, defaultGraph} from "@rdfjs/dataset";
import {dataFactory} from "@polypoly-eu/rdf";
import {Pod, PolyIn, PolyOut} from "./api";
import {promises as _fs} from "fs";

export type Fetch = typeof window.fetch;

export class MockPod implements Pod {

    public readonly store: RDF.DatasetCore;

    constructor(
        public readonly fs: typeof _fs,
        public readonly fetch: Fetch
    ) {
        this.store = dataset();
    }

    get polyIn(): PolyIn {
        return {
            factory: dataFactory,
            select: async matcher =>
                Array.from(
                    this.store.match(matcher.subject, matcher.predicate, matcher.object, defaultGraph())
                ),
            add: async (...quads) =>
                quads.forEach(quad => {
                    if (!quad.graph.equals(defaultGraph()))
                        throw new Error("Only default graph allowed");
                    this.store.add(quad);
                })
        };
    }

    get polyOut(): PolyOut {
        return {
            readFile: async (path, options) =>
                this.fs.readFile(path, { encoding: options.encoding }),
            httpRequest: async (url, method, body?, headers?) => {
                const response = await this.fetch(url, {
                    method,
                    headers,
                    body
                });
                if (response.ok)
                    return await response.text();
                else
                    throw new Error(response.status.toString());
            }
        };
    }

}

