/**
 * Skeleton implementation of the [[Pod]] API.
 *
 * All API components are implemented as stubs that delegate to some underlying implementation. See [[DefaultPod]] for
 * details.
 *
 * @packageDocumentation
 */

import * as RDF from "rdf-js";
import { dataFactory } from "../rdf";
import { Pod, PolyIn, PolyOut, PolyNav, Info, Endpoint } from "./api";
import { EncodingOptions, FS, Stats } from "./fs";
import { Entry } from ".";
import oxigraph from "oxigraph";

export const DEFAULT_POD_RUNTIME = "podjs-default";
export const DEFAULT_POD_RUNTIME_VERSION = "podjs-default-version";

/**
 * The [[PolyOut]] interface. See [[PolyOut]] for the description.
 */
export class DefaultPolyOut implements PolyOut {
    constructor(public readonly fs: FS) {}

    readFile(path: string, options: EncodingOptions): Promise<string>;
    readFile(path: string): Promise<Uint8Array>;
    readFile(
        path: string,
        options?: EncodingOptions
    ): Promise<string | Uint8Array> {
        if (options === undefined) return this.fs.readFile(path);
        else return this.fs.readFile(path, options);
    }

    readDir(path: string): Promise<Entry[]> {
        const newFiles = this.fs.readdir(path).then((files) => {
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
        return this.fs.stat(path);
    }

    writeFile(
        path: string,
        content: string,
        options: EncodingOptions
    ): Promise<void> {
        return this.fs.writeFile(path, content, options);
    }

    async importArchive(url: string, destUrl?: string): Promise<string> {
        throw new Error(
            `Called with ${url} and ${destUrl}, but not implemented`
        );
    }

    async removeArchive(fileId: string): Promise<void> {
        throw new Error(`Called with ${fileId}, but not implemented`);
    }
}

/**
 * The _default Pod_ provides the bare minimum implementation to satisfy the [[Pod]] API. It should only be used in
 * testing or development contexts.
 *
 * The implementation contains very little logic itself; merely a bit of glue code that mediates between the outer
 * interface and the implementations it delegates to. The underlying components are:
 *
 * 1. an [RDFJS dataset](https://rdf.js.org/dataset-spec/)
 * 2. a file system that adheres to the [async FS interface of Node.js](https://nodejs.org/api/fs.html)
 * 3. The *new* used rdf store, which supports SPARQL queries (oxigraph)
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
        public readonly polyOut: PolyOut = new DefaultPolyOut(fs),
        public readonly oxiStore: oxigraph.Store = new oxigraph.Store()
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
            query: async (query) => this.oxiStore.query(query),
            update: async (query) => this.oxiStore.update(query),
        };
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
            async getRuntime() {
                return DEFAULT_POD_RUNTIME;
            },
            async getVersion() {
                return DEFAULT_POD_RUNTIME_VERSION;
            },
        };
    }
    /**
     * The [[Endpoint]] interface. See [[Endpoint]] for the description.
     */
    get endpoint(): Endpoint {
        return {
            send(
                endpointId: string,
                payload: string,
                contentType?: string,
                authToken?: string
            ): Promise<void> {
                throw new Error(
                    `Called with ${endpointId}, ${payload}, ${contentType}, ${authToken} but not implemented`
                );
            },
            get(
                endpointId: string,
                contentType?: string,
                authToken?: string
            ): Promise<string> {
                throw new Error(
                    `Called with ${endpointId}, ${contentType}, ${authToken} but not implemented`
                );
            },
        };
    }
}
