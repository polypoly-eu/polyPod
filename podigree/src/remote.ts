import {
    Pod,
    PolyLifecycle,
    PolyIn,
    PolyOut,
    EncodingOptions,
    Stats,
    Matcher,
} from "@polypoly-eu/poly-api";
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
    add(...quads: Quad[]): ValueEndpointSpec<void>;
}>;

type PolyOutEndpoint = ObjectEndpointSpec<{
    readdir(path: string): ValueEndpointSpec<string[]>;
    readFile(path: string, options?: EncodingOptions): ValueEndpointSpec<string | Uint8Array>;
    writeFile(path: string, content: string, options: EncodingOptions): ValueEndpointSpec<void>;
    stat(path: string): ValueEndpointSpec<Stats>;
    fetch(input: string, init: RequestInit): ValueEndpointSpec<Response>;
}>;

type PolyLifecycleEndpoint = ObjectEndpointSpec<{
    listFeatures(): ValueEndpointSpec<Record<string, boolean>>;
    startFeature(id: string, background: boolean): ValueEndpointSpec<void>;
}>;

type PodEndpoint = ObjectEndpointSpec<{
    polyIn(): PolyInEndpoint;
    polyOut(): PolyOutEndpoint;
    polyLifecycle(): PolyLifecycleEndpoint;
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
        return new FileStats(stats.isFile(), stats.isDirectory());
    }

    constructor(readonly file: boolean, readonly directory: boolean) {}

    isFile(): boolean {
        return this.file;
    }
    isDirectory(): boolean {
        return this.directory;
    }
}

export const podBubblewrapClasses: Classes = {
    "@polypoly-eu/podigree.FetchResponse": FetchResponse,
    "@polypoly-eu/podigree.FileStats": FileStats,
    "@polypoly-eu/rdf.NamedNode": RDF.NamedNode,
    "@polypoly-eu/rdf.BlankNode": RDF.BlankNode,
    "@polypoly-eu/rdf.Literal": RDF.Literal,
    "@polypoly-eu/rdf.Variable": RDF.Variable,
    "@polypoly-eu/rdf.DefaultGraph": RDF.DefaultGraph,
    "@polypoly-eu/rdf.Quad": RDF.Quad,
};

function bubblewrapPort(rawPort: Port<Uint8Array, Uint8Array>): Port<any, any> {
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
        return new RemoteClientPod(liftClient(bubblewrapPort(rawPort)));
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
            select: (matcher) => this.rpcClient.polyIn().select(matcher)(),
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
                if (options === undefined) return rpcClient.polyOut().readFile(path)();
                else return rpcClient.polyOut().readFile(path, options)();
            }

            readdir(path: string): Promise<string[]> {
                return rpcClient.polyOut().readdir(path)();
            }

            stat(path: string): Promise<Stats> {
                return rpcClient.polyOut().stat(path)();
            }

            writeFile(path: string, content: string, options: EncodingOptions): Promise<void> {
                return rpcClient.polyOut().writeFile(path, content, options)();
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
}

// TODO move to poly-api?
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
        this.listen(liftServer<EndpointRequest, EndpointResponse>(bubblewrapPort(rawPort)));
    }

    async listenOnMiddleware(): Promise<RequestListener> {
        const { bubblewrapMiddlewarePort } = await import("@polypoly-eu/port-authority/dist/node");
        const [middleware, port] = bubblewrapMiddlewarePort(
            Bubblewrap.create(podBubblewrapClasses),
            { limit: "10mb" }
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
            readdir: (path) => polyOut.readdir(path),
            stat: async (path) => {
                const stats = await polyOut.stat(path);
                return FileStats.of(stats);
            },
            writeFile: (path, content, options) => polyOut.writeFile(path, content, options),
        };
    }

    polyIn(): ServerOf<PolyInEndpoint> {
        return this.pod.polyIn;
    }

    polyLifecycle(): ServerOf<PolyLifecycleEndpoint> {
        if (this.pod.polyLifecycle) return this.pod.polyLifecycle;

        return new DummyPolyLifecycle();
    }
}
