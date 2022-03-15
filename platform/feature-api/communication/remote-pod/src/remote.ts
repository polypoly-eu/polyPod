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
    Network,
    Info,
    Entry,
} from "@polypoly-eu/pod-api";
import type { RequestInit, Response } from "@polypoly-eu/fetch-spec";
import { DataFactory, Quad } from "rdf-js";
import {
    endpointClient,
    ClientOf,
    ServerOf,
    EndpointRequest,
    EndpointResponse,
    endpointServer,
    ObjectEndpointSpec,
    ValueEndpointSpec,
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

type PolyInEndpoint = ObjectEndpointSpec<{
    select(matcher: Partial<Matcher>): ValueEndpointSpec<Quad[]>;
    match(matcher: Partial<Matcher>): ValueEndpointSpec<Quad[]>;
    add(...quads: Quad[]): ValueEndpointSpec<void>;
    delete(...quads: Quad[]): ValueEndpointSpec<void>;
    has(...quads: Quad[]): ValueEndpointSpec<boolean>;
}>;

type PolyOutEndpoint = ObjectEndpointSpec<{
    readDir(path: string): ValueEndpointSpec<Entry[]>;
    readFile(path: string, options?: EncodingOptions): ValueEndpointSpec<string | Uint8Array>;
    writeFile(path: string, content: string, options: EncodingOptions): ValueEndpointSpec<void>;
    stat(path: string): ValueEndpointSpec<Stats>;
    fetch(input: string, init: RequestInit): ValueEndpointSpec<Response>;
    importArchive(url: string): ValueEndpointSpec<string>;
    removeArchive(fileId: string): ValueEndpointSpec<void>;
}>;

type PolyLifecycleEndpoint = ObjectEndpointSpec<{
    listFeatures(): ValueEndpointSpec<Record<string, boolean>>;
    startFeature(id: string, background: boolean): ValueEndpointSpec<void>;
}>;

type PolyNavEndpoint = ObjectEndpointSpec<{
    openUrl(url: string): ValueEndpointSpec<void>;
    setActiveActions(actions: string[]): ValueEndpointSpec<void>;
    setTitle(title: string): ValueEndpointSpec<void>;
    pickFile(type?: string): ValueEndpointSpec<ExternalFile | null>;
}>;

type InfoEndpoint = ObjectEndpointSpec<{
    getRuntime(): ValueEndpointSpec<string>;
    getVersion(): ValueEndpointSpec<string>;
}>;

type NetworkEndpoint = ObjectEndpointSpec<{
    httpPost(
        url: string,
        body: string,
        contentType?: string,
        authorization?: string
    ): ValueEndpointSpec<string | undefined>;
}>;

type PodEndpoint = ObjectEndpointSpec<{
    polyIn(): PolyInEndpoint;
    polyOut(): PolyOutEndpoint;
    polyLifecycle(): PolyLifecycleEndpoint;
    polyNav(): PolyNavEndpoint;
    info(): InfoEndpoint;
    network(): NetworkEndpoint;
}>;

class FetchResponse implements Response {
    readonly ok: boolean;
    readonly redirected: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly type: ResponseType;
    readonly url: string;

    static async of(response: Response): Promise<FetchResponse> {
        return new FetchResponse(response, await response.text());
    }

    constructor(response: Response, private readonly bufferedText: string) {
        this.ok = response.ok;
        this.redirected = response.redirected;
        this.status = response.status;
        this.statusText = response.statusText;
        this.type = response.type;
        this.url = response.url;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async json(): Promise<any> {
        // JSON parse error must be asynchronous (i.e. rejected promise)
        return JSON.parse(this.bufferedText);
    }

    text(): Promise<string> {
        return Promise.resolve(this.bufferedText);
    }
}

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
    "@polypoly-eu/remote-pod.FetchResponse": FetchResponse,
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
    private readonly rpcClient: ClientOf<PodEndpoint>;

    static fromFetch(url: string, fetch: typeof window.fetch = window.fetch): RemoteClientPod {
        const port = bubblewrapFetchPort(url, Bubblewrap.create(podBubblewrapClasses), fetch);

        return new RemoteClientPod(port);
    }

    static fromRawPort(rawPort: Port<Uint8Array, Uint8Array>): RemoteClientPod {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrappedPort = bubblewrapPort(rawPort) as Port<any, any>;
        return new RemoteClientPod(liftClient(wrappedPort));
    }

    constructor(
        private clientPort: RequestPort<EndpointRequest, EndpointResponse>,
        public readonly dataFactory: DataFactory = RDF.dataFactory
    ) {
        this.rpcClient = endpointClient<PodEndpoint>(client(clientPort));
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
            fetch(input: string, init?: RequestInit): Promise<Response> {
                return rpcClient.polyOut().fetch(input, init || {})();
            }

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

    get network(): Network {
        return {
            httpPost: (url: string, body: string, contentType?: string, authorization?: string) =>
                this.rpcClient.network().httpPost(url, body, contentType, authorization)(),
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

export class RemoteServerPod implements ServerOf<PodEndpoint> {
    constructor(private readonly pod: Pod) {}

    listen(port: ResponsePort<EndpointRequest, EndpointResponse>): void {
        server(port, endpointServer<PodEndpoint>(this));
    }

    listenOnRaw(rawPort: Port<Uint8Array, Uint8Array>): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrappedPort = bubblewrapPort(rawPort) as Port<any, any>;
        this.listen(liftServer<EndpointRequest, EndpointResponse>(wrappedPort));
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

    polyOut(): ServerOf<PolyOutEndpoint> {
        const polyOut = this.pod.polyOut;

        // the following implementation delegates strictly to the pod that has been provided to the constructor
        // the only difference is that `fetch` needs to return a slightly modified response

        return {
            fetch: async (input, init) => {
                const response = await polyOut.fetch(input, init);
                return FetchResponse.of(response);
            },
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

    polyIn(): ServerOf<PolyInEndpoint> {
        return this.pod.polyIn;
    }

    polyLifecycle(): ServerOf<PolyLifecycleEndpoint> {
        if (this.pod.polyLifecycle) return this.pod.polyLifecycle;

        return new DummyPolyLifecycle();
    }

    polyNav(): ServerOf<PolyNavEndpoint> {
        return this.pod.polyNav;
    }

    info(): ServerOf<InfoEndpoint> {
        return this.pod.info;
    }

    network(): ServerOf<NetworkEndpoint> {
        return this.pod.network;
    }
}
