import { dataset } from "@rdfjs/dataset";
import { IFs, Volume } from "memfs";
import * as RDF from "rdf-js";
import { v4 as uuidv4 } from "uuid";
import { dataFactory } from "../rdf";
import {
    Endpoint,
    Info,
    Matcher,
    Pod,
    PolyIn,
    PolyNav,
    PolyOut,
    Stats,
    Triplestore,
} from "./api";
import { Entry } from ".";

/**
 * A mock implementation of the [[PolyIn]] interface.
 */
export class MockPolyIn implements PolyIn {
    /**
     * Creates a new instance of [[MockPolyIn]].
     * @param {RDF.DatasetCore} store - The RDF store to use.
     */
    constructor(public readonly store: RDF.DatasetCore = dataset()) {}

    private checkQuad(quad: RDF.Quad): void {
        if (!quad.graph.equals(dataFactory.defaultGraph()))
            throw new Error("Only default graph allowed");
    }

    /** @inheritdoc */
    async match(matcher: Partial<Matcher>): Promise<RDF.Quad[]> {
        return Array.from(
            this.store.match(
                matcher.subject,
                matcher.predicate,
                matcher.object,
                dataFactory.defaultGraph()
            )
        );
    }

    /** @inheritdoc */
    async add(quad: RDF.Quad): Promise<void> {
        this.checkQuad(quad);
        this.store.add(quad);
    }

    /** @inheritdoc */
    async delete(quad: RDF.Quad): Promise<void> {
        this.checkQuad(quad);
        this.store.delete(quad);
    }

    /** @inheritdoc */
    async has(quad: RDF.Quad): Promise<boolean> {
        this.checkQuad(quad);
        return this.store.has(quad);
    }
}

/**
 * A mock implementation of the [[PolyOut]] interface.
 */
export class MockPolyOut implements PolyOut {
    private static readonly PROTOCOL = "polypod://";

    /**
     * Creates a new instance of [[MockPolyOut]].
     * @param {IFs["promises"]} fs - The file system to use
     */
    constructor(public readonly fs: IFs["promises"] = new Volume().promises) {}

    /** @inheritdoc */
    async readFile(path: string): Promise<Buffer> {
        return (await this.fs.readFile(path)) as Buffer;
    }

    /** @inheritdoc */
    readDir(path: string): Promise<Entry[]> {
        const newFiles = this.fs.readdir(path).then((files) => {
            const objectFiles = files.map((file) => ({
                id: path + "/" + file,
                path: file as string,
            }));
            return new Promise<Entry[]>((resolve) => {
                resolve(objectFiles);
            });
        });
        return newFiles;
    }

    /** @inheritdoc */
    async stat(path: string): Promise<Stats> {
        const stats = await this.fs.stat(path);
        return {
            id: stats.ino.toString(),
            size: stats.size as number,
            time: stats.ctime.toISOString(),
            name: path,
            directory: stats.isDirectory(),
        };
    }

    /** @inheritdoc */
    async writeFile(path: string, content: string): Promise<void> {
        return this.fs.writeFile(path, content);
    }

    /** @inheritdoc */
    async importArchive(path: string, destUri?: string): Promise<string> {
        if (!destUri) {
            destUri = `${MockPolyOut.PROTOCOL}{uuidv4()}`;
        } else {
            if (!destUri.startsWith(MockPolyOut.PROTOCOL)) {
                throw new Error(`${destUri} is not a polyPod URI`);
            }
        }
        return destUri;
    }

    /** @inheritdoc */
    async removeArchive(fileId: string): Promise<void> {
        throw new Error(`Called with ${fileId}, but not implemented`);
    }
}

/**
 * A mock implementation of the [[Pod]] interface.
 *
 * All functionality is stubbed out, storing data in memory by default.
 */
export class MockPod implements Pod {
    public static readonly INFO_RUNTIME = "mock-pod";
    public static readonly INFO_VERSION = "mock-pod-version";

    public readonly dataFactory: RDF.DataFactory = dataFactory;

    /**
     * Creates a new [[MockPod]] instance.
     * @param {PolyIn} polyIn - The [[PolyIn]] instance to use.
     * @param {PolyOut} polyOut - The [[PolyOut]] instance to use.
     */
    constructor(
        public readonly polyIn: PolyIn = new MockPolyIn(),
        public readonly polyOut: PolyOut = new MockPolyOut()
    ) {}

    /** @inheritdoc */
    get triplestore(): Triplestore {
        return {
            query: async (query: string) => {
                throw new Error(`Called with ${query}, but not implemented`);
            },
            update: async (query: string) => {
                throw new Error(`Called with ${query}, but not implemented`);
            },
        };
    }

    /** @inheritdoc */
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

    /** @inheritdoc */
    get info(): Info {
        return {
            async getRuntime() {
                return MockPod.INFO_RUNTIME;
            },
            async getVersion() {
                return MockPod.INFO_VERSION;
            },
        };
    }

    /** @inheritdoc */
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
