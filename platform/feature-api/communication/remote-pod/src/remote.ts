import {
    Pod,
    PolyLifecycle,
    PolyIn,
    PolyOut,
    PolyNav,
    EncodingOptions,
    ExternalFile,
    Stats,
    Matcher,
    Info,
    Entry,
    Endpoint,
} from "@polypoly-eu/pod-api";
import { DataFactory, Quad } from "rdf-js";
import {
    backendClient,
    ClientOf,
    ServerOf,
    BackendRequest,
    BackendResponse,
    backendServer,
    ObjectBackendSpec,
    ValueBackendSpec,
} from "@polypoly-eu/postoffice";
import {
    ResponsePort,
    liftServer,
    server,
    bubblewrapFetchPort,
    RequestPort,
    client,
    Port,
    liftClient,
    mapPort,
} from "@polypoly-eu/port-authority";
import { RequestListener } from "http";
import * as RDF from "@polypoly-eu/rdf";
import { Bubblewrap, Classes } from "@polypoly-eu/bubblewrap";

type PolyInBackend = ObjectBackendSpec<{
    select(matcher: Partial<Matcher>): ValueBackendSpec<Quad[]>;
    match(matcher: Partial<Matcher>): ValueBackendSpec<Quad[]>;
    add(...quads: Quad[]): ValueBackendSpec<void>;
    delete(...quads: Quad[]): ValueBackendSpec<void>;
    has(...quads: Quad[]): ValueBackendSpec<boolean>;
}>;

type PolyOutBackend = ObjectBackendSpec<{
    readDir(path: string): ValueBackendSpec<Entry[]>;
    readFile(path: string, options?: EncodingOptions): ValueBackendSpec<string | Uint8Array>;
    writeFile(path: string, content: string, options: EncodingOptions): ValueBackendSpec<void>;
    stat(path: string): ValueBackendSpec<Stats>;
    importArchive(url: string): ValueBackendSpec<string>;
    removeArchive(fileId: string): ValueBackendSpec<void>;
}>;

type PolyLifecycleBackend = ObjectBackendSpec<{
    listFeatures(): ValueBackendSpec<Record<string, boolean>>;
    startFeature(id: string, background: boolean): ValueBackendSpec<void>;
}>;

type PolyNavBackend = ObjectBackendSpec<{
    openUrl(url: string): ValueBackendSpec<void>;
    setActiveActions(actions: string[]): ValueBackendSpec<void>;
    setTitle(title: string): ValueBackendSpec<void>;
    pickFile(type?: string): ValueBackendSpec<ExternalFile | null>;
}>;

type InfoBackend = ObjectBackendSpec<{
    getRuntime(): ValueBackendSpec<string>;
    getVersion(): ValueBackendSpec<string>;
}>;

type EndpointBackend = ObjectBackendSpec<{
    send(
        endpointId: string,
        featureIdToken: string,
        payload: string,
        contentType?: string,
        authorization?: string
    ): ValueBackendSpec<void>;
    get(
        endpointId: string,
        featureIdToken: string,
        contentType?: string,
        authorization?: string
    ): ValueBackendSpec<string>;
}>;

type PodBackend = ObjectBackendSpec<{
    polyIn(): PolyInBackend;
    polyOut(): PolyOutBackend;
    polyLifecycle(): PolyLifecycleBackend;
    polyNav(): PolyNavBackend;
    info(): InfoBackend;
    endpoint(): EndpointBackend;
}>;

class FileStats implements Stats {
    static of(stats: Stats): FileStats {
        if (
            stats.getSize !== undefined &&
            stats.getName !== undefined &&
            stats.getTime !== undefined &&
            stats.getId !== undefined
        ) {
            return new FileStats(
                stats.isFile(),
                stats.isDirectory(),
                stats.getTime(),
                stats.getSize(),
                stats.getName(),
                stats.getId()
            );
        } else {
            return new FileStats(stats.isFile(), stats.isDirectory(), "", 0, "", "");
        }
    }

    constructor(
        readonly file: boolean,
        readonly directory: boolean,
        readonly time: string,
        readonly size: number,
        readonly name: string,
        readonly id: string
    ) {}
    isFile(): boolean {
        return this.file;
    }
    isDirectory(): boolean {
        return this.directory;
    }
    getTime(): string {
        return this.time;
    }
    getSize(): number {
        return this.size;
    }
    getName(): string {
        return this.name;
    }
    getId(): string {
        return this.id;
    }
}

export const podBubblewrapClasses: Classes = {
    "@polypoly-eu/remote-pod.FileStats": FileStats,
    "@polypoly-eu/rdf.NamedNode": RDF.NamedNode,
    "@polypoly-eu/rdf.BlankNode": RDF.BlankNode,
    "@polypoly-eu/rdf.Literal": RDF.Literal,
    "@polypoly-eu/rdf.Variable": RDF.Variable,
    "@polypoly-eu/rdf.DefaultGraph": RDF.DefaultGraph,
    "@polypoly-eu/rdf.Quad": RDF.Quad,
};

function bubblewrapPort(rawPort: Port<Uint8Array, Uint8Array>): Port<Uint8Array, Uint8Array> {
    const podBubblewrap = Bubblewrap.create(podBubblewrapClasses);
    return mapPort(
        rawPort,
        (buf) => podBubblewrap.decode(buf),
        (data) => podBubblewrap.encode(data)
    );
}

export class RemoteClientPod implements Pod {
    private readonly rpcClient: ClientOf<PodBackend>;

    static fromRawPort(rawPort: Port<Uint8Array, Uint8Array>): RemoteClientPod {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrappedPort = bubblewrapPort(rawPort) as Port<any, any>;
        return new RemoteClientPod(liftClient(wrappedPort));
    }

    constructor(
        private clientPort: RequestPort<BackendRequest, BackendResponse>,
        public readonly dataFactory: DataFactory = RDF.dataFactory
    ) {
        this.rpcClient = backendClient<PodBackend>(client(clientPort));
    }

    get polyIn(): PolyIn {
        return {
            add: (...quads) => this.rpcClient.polyIn().add(...quads)(),
            match: (matcher) => this.rpcClient.polyIn().match(matcher)(),
            select: (matcher) => this.rpcClient.polyIn().select(matcher)(),
            delete: (...quads) => this.rpcClient.polyIn().delete(...quads)(),
            has: (...quads) => this.rpcClient.polyIn().has(...quads)(),
        };
    }

    get polyOut(): PolyOut {
        const { rpcClient } = this;

        return new (class implements PolyOut {
            readFile(path: string, options: EncodingOptions): Promise<string>;
            readFile(path: string): Promise<Uint8Array>;
            readFile(path: string, options?: EncodingOptions): Promise<string | Uint8Array> {
                if (options) return rpcClient.polyOut().readFile(path, options)();
                else if (typeof fetch === "undefined") return rpcClient.polyOut().readFile(path)();
                else
                    return new Promise<Uint8Array>((resolve, reject) => {
                        fetch(path)
                            .then((res) => res.arrayBuffer())
                            .then((arrBuf) => resolve(new Uint8Array(arrBuf)))
                            .catch((err) => reject(err));
                    });
            }

            readDir(path: string): Promise<Entry[]> {
                return rpcClient.polyOut().readDir(path)();
            }

            stat(path: string): Promise<Stats> {
                return rpcClient.polyOut().stat(path)();
            }

            writeFile(path: string, content: string, options: EncodingOptions): Promise<void> {
                return rpcClient.polyOut().writeFile(path, content, options)();
            }

            importArchive(url: string): Promise<string> {
                return rpcClient.polyOut().importArchive(url)();
            }

            removeArchive(fileId: string): Promise<void> {
                return rpcClient.polyOut().removeArchive(fileId)();
            }
        })();
    }

    get polyLifecycle(): PolyLifecycle {
        return {
            listFeatures: () => this.rpcClient.polyLifecycle().listFeatures()(),
            startFeature: (id, background) =>
                this.rpcClient.polyLifecycle().startFeature(id, background)(),
        };
    }

    get polyNav(): PolyNav {
        return {
            openUrl: (url: string) => this.rpcClient.polyNav().openUrl(url)(),
            setActiveActions: (actions: string[]) =>
                this.rpcClient.polyNav().setActiveActions(actions)(),
            setTitle: (title: string) => this.rpcClient.polyNav().setTitle(title)(),
            pickFile: (type?: string) => this.rpcClient.polyNav().pickFile(type)(),
        };
    }

    get info(): Info {
        return {
            getRuntime: () => this.rpcClient.info().getRuntime()(),
            getVersion: () => this.rpcClient.info().getVersion()(),
        };
    }

    get endpoint(): Endpoint {
        return {
            send: (
                endpointId: string,
                featureIdToken: string,
                payload: string,
                contentType?: string,
                authorization?: string
            ) =>
                this.rpcClient
                    .endpoint()
                    .send(endpointId, featureIdToken, payload, contentType, authorization)(),
            get: (
                endpointId: string,
                featureIdToken: string,
                contentType?: string,
                authorization?: string
            ) =>
                this.rpcClient
                    .endpoint()
                    .get(endpointId, featureIdToken, contentType, authorization)(),
        };
    }
}

// TODO move to pod-api?
// TODO should this throw instead?
class DummyPolyLifecycle implements PolyLifecycle {
    async listFeatures(): Promise<Record<string, boolean>> {
        return {};
    }

    async startFeature(): Promise<void> {
        return;
    }
}

export class RemoteServerPod implements ServerOf<PodBackend> {
    constructor(private readonly pod: Pod) {}

    listen(port: ResponsePort<BackendRequest, BackendResponse>): void {
        server(port, backendServer<PodBackend>(this));
    }

    listenOnRaw(rawPort: Port<Uint8Array, Uint8Array>): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrappedPort = bubblewrapPort(rawPort) as Port<any, any>;
        this.listen(liftServer<BackendRequest, BackendResponse>(wrappedPort));
    }

    async listenOnMiddleware(): Promise<RequestListener> {
        const { bubblewrapMiddlewarePort } = await import("@polypoly-eu/port-authority/dist/node");
        const [middleware, port] = bubblewrapMiddlewarePort(
            Bubblewrap.create(podBubblewrapClasses),
            {
                limit: "10mb",
            }
        );
        this.listen(port);
        return middleware;
    }

    polyOut(): ServerOf<PolyOutBackend> {
        const polyOut = this.pod.polyOut;

        // the following implementation delegates strictly to the pod that has been provided to the constructor
        // the only difference is that `fetch` needs to return a slightly modified response

        return {
            readFile: (path, options?) => {
                if (options === undefined) return polyOut.readFile(path);
                else return polyOut.readFile(path, options);
            },
            readDir: (path) => polyOut.readDir(path),
            stat: async (path) => {
                const stats = await polyOut.stat(path);
                return FileStats.of(stats);
            },
            writeFile: (path, content, options) => polyOut.writeFile(path, content, options),
            importArchive: (url) => polyOut.importArchive(url),
            removeArchive: (fileId) => polyOut.removeArchive(fileId),
        };
    }

    polyIn(): ServerOf<PolyInBackend> {
        return this.pod.polyIn;
    }

    polyLifecycle(): ServerOf<PolyLifecycleBackend> {
        if (this.pod.polyLifecycle) return this.pod.polyLifecycle;

        return new DummyPolyLifecycle();
    }

    polyNav(): ServerOf<PolyNavBackend> {
        return this.pod.polyNav;
    }

    info(): ServerOf<InfoBackend> {
        return this.pod.info;
    }

    endpoint(): ServerOf<EndpointBackend> {
        return this.pod.endpoint;
    }
}
