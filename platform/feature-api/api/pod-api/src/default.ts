/**
 * Skeleton implementation of the [[Pod]] API.
 *
 * All API components are implemented as stubs that delegate to some underlying implementation. See [[DefaultPod]] for
 * details.
 *
 * @packageDocumentation
 */

import * as RDF from "rdf-js";
import { dataFactory } from "@polypoly-eu/rdf";
import { Pod, PolyIn, PolyOut, PolyNav, Info, Network } from "./api";
import type { Fetch, Response, RequestInit } from "@polypoly-eu/fetch-spec";
import { EncodingOptions, FS, Stats } from "./fs";
import { Entry } from ".";

/**
 * The _default Pod_ provides the bare minimum implementation to satisfy the [[Pod]] API. It should only be used in
 * testing or development contexts.
 *
 * The implementation contains very little logic itself; merely a bit of glue code that mediates between the outer
 * interface and the implementations it delegates to. The underlying components are:
 *
 * 1. an [RDFJS dataset](https://rdf.js.org/dataset-spec/)
 * 2. a file system that adheres to the [async FS interface of Node.js](https://nodejs.org/api/fs.html)
 * 3. a [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) implementation. This feature is deprecated and will be eliminated in the near future.
 *
 * Depending on the platform (Node.js or browser), there are various implementations of these that may be used.
 * These are found in other core components, such as AsyncPod.
 *
 * *Note*:  This DefaultPod exposes all the underlying implementations to the Feature, which may pose security risks in production
 * systems, unless the underlying implementations implement their own access control logic.
 */
export class DefaultPod implements Pod {
    public readonly dataFactory: RDF.DataFactory = dataFactory;

    constructor(
        public readonly store: RDF.DatasetCore,
        public readonly fs: FS,
        public readonly fetch: Fetch
    ) {}

    private checkQuad(quad: RDF.Quad): void {
        if (!quad.graph.equals(dataFactory.defaultGraph()))
            throw new Error("Only default graph allowed");
    }
    /**
     * The [[PolyIn]] interface. See [[PolyIn]] for the description.
     */
    get polyIn(): PolyIn {
        return {
            match: async (matcher) =>
                Array.from(
                    this.store.match(
                        matcher.subject,
                        matcher.predicate,
                        matcher.object,
                        dataFactory.defaultGraph()
                    )
                ),
            select: async (matcher) =>
                Array.from(
                    this.store.match(
                        matcher.subject,
                        matcher.predicate,
                        matcher.object,
                        dataFactory.defaultGraph()
                    )
                ),
            add: async (...quads) =>
                quads.forEach((quad) => {
                    this.checkQuad(quad);
                    this.store.add(quad);
                }),
            delete: async (...quads) =>
                quads.forEach((quad) => {
                    this.checkQuad(quad);
                    this.store.delete(quad);
                }),
            has: async (...quads) =>
                quads.some((quad) => {
                    this.checkQuad(quad);
                    return this.store.has(quad);
                }),
        };
    }

    /**
     * The [[PolyOut]] interface. See [[PolyOut]] for the description.
     */
    get polyOut(): PolyOut {
        const fs = this.fs;
        const _fetch = this.fetch;

        return new (class implements PolyOut {
            fetch(input: string, init?: RequestInit): Promise<Response> {
                return _fetch(input, init);
            }

            readFile(path: string, options: EncodingOptions): Promise<string>;
            readFile(path: string): Promise<Uint8Array>;
            readFile(path: string, options?: EncodingOptions): Promise<string | Uint8Array> {
                if (options === undefined) return fs.readFile(path);
                else return fs.readFile(path, options);
            }

            readDir(path: string): Promise<Entry[]> {
                const newFiles = fs.readdir(path).then((files) => {
                    const objectFiles = files.map((file) => ({
                        id: path + "/" + file,
                        path: file,
                    }));
                    return new Promise<Entry[]>((resolve) => {
                        resolve(objectFiles);
                    });
                });
                return newFiles;
            }

            stat(path: string): Promise<Stats> {
                return fs.stat(path);
            }

            writeFile(path: string, content: string, options: EncodingOptions): Promise<void> {
                return fs.writeFile(path, content, options);
            }

            importArchive(url: string): Promise<string> {
                throw new Error(`Called with ${url}, but not implemented`);
            }

            removeArchive(fileId: string): Promise<void> {
                throw new Error(`Called with ${fileId}, but not implemented`);
            }
        })();
    }
    /**
     * The [[PolyNav]] interface. See [[PolyNav]] for the description.
     */
    get polyNav(): PolyNav {
        return {
            openUrl: async (url: string) => {
                throw new Error(`Called with ${url}, but not implemented`);
            },
            setActiveActions: async (actions: string[]) => {
                throw new Error(`Called with ${actions}, but not implemented`);
            },
            setTitle: async (title: string) => {
                throw new Error(`Called with ${title}, but not implemented`);
            },
            pickFile: async () => {
                throw new Error("Not implemented");
            },
        };
    }
    /**
     * The [[Info]] interface. See [[Info]] for the description.
     */
    get info(): Info {
        return {
            getRuntime() {
                throw new Error("Not implemented");
            },
            getVersion() {
                throw new Error("Not implemented");
            },
        };
    }
    /**
     * The [[Network]] interface. See [[Network]] for the description.
     */

    get network(): Network {
        return {
            httpPost(url: string, body: string, contentType?: string, authorization?: string) {
                throw new Error(
                    `Called with ${url}, ${body}, ${contentType}, ${authorization} but not implemented`
                );
            },
        };
    }
}
