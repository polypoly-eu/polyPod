import {
    Pod,
    PolyLifecycle,
    PolyIn,
    PolyOut,
    PolyNav,
    ExternalFile,
    Stats,
    Matcher,
    Info,
    Entry,
    Endpoint,
    NamedNode,
    BlankNode,
    Literal,
    Variable,
    DefaultGraph,
    Quad as polyQuad,
    DataFactory,
} from "@polypoly-eu/api";
import { Quad } from "rdf-js";
import { RequestListener } from "http";
import {
    ResponsePort,
    liftServer,
    server,
    RequestPort,
    client,
    Port,
    liftClient,
    mapPort,
    Bubblewrap,
    Classes,
    backendClient,
    ClientOf,
    ServerOf,
    BackendRequest,
    BackendResponse,
    backendServer,
    ObjectBackendSpec,
    ValueBackendSpec,
} from "../index";

type PolyInBackend = ObjectBackendSpec<{
    match(matcher: Partial<Matcher>): ValueBackendSpec<Quad[]>;
    add(...quads: Quad[]): ValueBackendSpec<void>;
    delete(...quads: Quad[]): ValueBackendSpec<void>;
    has(...quads: Quad[]): ValueBackendSpec<boolean>;
}>;

type PolyOutBackend = ObjectBackendSpec<{
    readDir(path: string): ValueBackendSpec<Entry[]>;
    readFile(path: string): ValueBackendSpec<Uint8Array>;
    writeFile(path: string, content: string): ValueBackendSpec<void>;
    stat(path: string): ValueBackendSpec<Stats>;
    importArchive(url: string, destUrl?: string): ValueBackendSpec<string>;
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
        payload: string,
        contentType?: string,
        authToken?: string
    ): ValueBackendSpec<void>;
    get(
        endpointId: string,
        contentType?: string,
        authToken?: string
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

export const podBubblewrapClasses: Classes = {
    "@polypoly-eu/rdf.NamedNode": NamedNode,
    "@polypoly-eu/rdf.BlankNode": BlankNode,
    "@polypoly-eu/rdf.Literal": Literal,
    "@polypoly-eu/rdf.Variable": Variable,
    "@polypoly-eu/rdf.DefaultGraph": DefaultGraph,
    "@polypoly-eu/rdf.Quad": polyQuad,
};

function bubblewrapPort(
    rawPort: Port<Uint8Array, Uint8Array>
): Port<Uint8Array, Uint8Array> {
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
        public readonly dataFactory: DataFactory = new DataFactory(false)
    ) {
        this.rpcClient = backendClient<PodBackend>(client(clientPort));
    }

    get polyIn(): PolyIn {
        return {
            add: (...quads) => this.rpcClient.polyIn().add(...quads)(),
            match: (matcher) => this.rpcClient.polyIn().match(matcher)(),
            delete: (...quads) => this.rpcClient.polyIn().delete(...quads)(),
            has: (...quads) => this.rpcClient.polyIn().has(...quads)(),
        };
    }

    get polyOut(): PolyOut {
        const { rpcClient } = this;

        return new (class implements PolyOut {
            readFile(path: string): Promise<Uint8Array> {
                if (typeof fetch === "undefined")
                    return rpcClient.polyOut().readFile(path)();
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

            writeFile(path: string, content: string): Promise<void> {
                return rpcClient.polyOut().writeFile(path, content)();
            }

            importArchive(url: string, destUrl?: string): Promise<string> {
                return rpcClient.polyOut().importArchive(url, destUrl)();
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
            setTitle: (title: string) =>
                this.rpcClient.polyNav().setTitle(title)(),
            pickFile: (type?: string) =>
                this.rpcClient.polyNav().pickFile(type)(),
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
                payload: string,
                contentType?: string,
                authToken?: string
            ) =>
                this.rpcClient
                    .endpoint()
                    .send(endpointId, payload, contentType, authToken)(),
            get: (
                endpointId: string,
                contentType?: string,
                authToken?: string
            ) =>
                this.rpcClient
                    .endpoint()
                    .get(endpointId, contentType, authToken)(),
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
        const { bubblewrapMiddlewarePort } = await import(
            "../port-authority/middleware"
        );
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
            readFile: (path) => polyOut.readFile(path),
            readDir: (path) => polyOut.readDir(path),
            stat: (path) => polyOut.stat(path),
            writeFile: (path, content) => polyOut.writeFile(path, content),
            importArchive: (url, destUrl) =>
                polyOut.importArchive(url, destUrl),
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
