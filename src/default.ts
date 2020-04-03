import * as RDF from "rdf-js";
import {dataFactory} from "@polypoly-eu/rdf";
import {Pod, PolyIn, PolyOut} from "./api";
import {promises as _fs} from "fs";

export type Fetch = typeof window.fetch;

export class DefaultPod implements Pod {

    constructor(
        public readonly store: RDF.DatasetCore,
        public readonly fs: typeof _fs,
        public readonly fetch: Fetch
    ) {
    }

    get polyIn(): PolyIn {
        return {
            factory: dataFactory,
            select: async matcher =>
                Array.from(
                    this.store.match(matcher.subject, matcher.predicate, matcher.object, dataFactory.defaultGraph())
                ),
            add: async (...quads) =>
                quads.forEach(quad => {
                    if (!quad.graph.equals(dataFactory.defaultGraph()))
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

