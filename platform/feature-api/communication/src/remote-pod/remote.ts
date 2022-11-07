import {
    Pod,
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
    Triplestore,
    SPARQLQueryResult,
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
    add(quad: Quad): ValueBackendSpec<void>;
    delete(quad: Quad): ValueBackendSpec<void>;
    has(quad: Quad): ValueBackendSpec<boolean>;
}>;

type TriplestoreBackend = ObjectBackendSpec<{
    query(query: string): ValueBackendSpec<SPARQLQueryResult>;
    update(query: string): ValueBackendSpec<void>;
}>;

type PolyOutBackend = ObjectBackendSpec<{
    readDir(path: string): ValueBackendSpec<Entry[]>;
    readFile(path: string): ValueBackendSpec<Uint8Array>;
    writeFile(path: string, content: string): ValueBackendSpec<void>;
    stat(path: string): ValueBackendSpec<Stats>;
    importArchive(url: string, destUrl?: string): ValueBackendSpec<string>;
    removeArchive(fileId: string): ValueBackendSpec<void>;
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
    polyNav(): PolyNavBackend;
    info(): InfoBackend;
    endpoint(): EndpointBackend;
    triplestore(): TriplestoreBackend;
}>;

/**
 * Creating a map of classes that can be used to create objects from JSON-LD.
 * @const podBubblewrapClasses
 */
export const podBubblewrapClasses: Classes = {
    "@polypoly-eu/rdf.NamedNode": NamedNode,
    "@polypoly-eu/rdf.BlankNode": BlankNode,
    "@polypoly-eu/rdf.Literal": Literal,
    "@polypoly-eu/rdf.Variable": Variable,
    "@polypoly-eu/rdf.DefaultGraph": DefaultGraph,
    "@polypoly-eu/rdf.Quad": polyQuad,
};

/**
 * Creating a new instance of the Bubblewrap class and assigning it to the podBubblewrap variable.
 * @const podBubblewrap
 */
export const podBubblewrap = Bubblewrap.create(podBubblewrapClasses);

/**
 * It uses the `pod-bubblewrap` library to wrap a raw port passed to a port
 * that sends and receives `Uint8Array`s, but the data is encoded and decoded
 * on both the incoming (covariant) and outgoing (contravariant) messages.
 *
 * @param rawPort - The raw port that we want to wrap.
 * @returns A function that takes a port and returns a port.
 */
function bubblewrapPort(
    rawPort: Port<Uint8Array, Uint8Array>
): Port<Uint8Array, Uint8Array> {
    return mapPort(
        rawPort,
        (buf) => podBubblewrap.decode(buf),
        (data) => podBubblewrap.encode(data)
    );
}

/**
 * @class RemoteClientPod
 * @classdesc It's a wrapper around a `ClientOf<PodBackend>`
 * @implements the [[Pod]] interface
 */
export class RemoteClientPod implements Pod {
    private readonly rpcClient: ClientOf<PodBackend>;

    /**
     * It creates a [[RemoteClientPod]] object and initiates the rpc client connection to the port passed
     * @param {RequestPort<BackendRequest, BackendResponse>} clientPort - This is the port that the client will use to communicate with the backend.
     * @param {DataFactory} dataFactory - DataFactory = new DataFactory(false)
     */
    constructor(
        private clientPort: RequestPort<BackendRequest, BackendResponse>,
        public readonly dataFactory: DataFactory = new DataFactory(false)
    ) {
        this.rpcClient = backendClient<PodBackend>(client(this.clientPort));
    }

    /**
     * It takes a raw port, wraps it in a bubblewrap port, and then lifts it into a client
     * @param rawPort - The port that was passed to the `onConnect` callback.
     * @returns A RemoteClientPod
     */
    static fromRawPort(rawPort: Port<Uint8Array, Uint8Array>): RemoteClientPod {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrappedPort = bubblewrapPort(rawPort) as Port<any, any>;
        return new RemoteClientPod(liftClient(wrappedPort));
    }

    /**
     * `polyIn` is a function that returns a [[PolyIn]] object based on the rpc client connection of the pod.
     * @returns {PolyIn} - A PolyIn object.
     */
    get polyIn(): PolyIn {
        return {
            add: (quad) => this.rpcClient.polyIn().add(quad)(),
            match: (matcher) => this.rpcClient.polyIn().match(matcher)(),
            delete: (quad) => this.rpcClient.polyIn().delete(quad)(),
            has: (quad) => this.rpcClient.polyIn().has(quad)(),
        };
    }

    /**
     * It returns a `Triplestore` object of the pod
     * @returns {Triplestore} - the triplestore object.
     */
    get triplestore(): Triplestore {
        return {
            query: (query: string) =>
                this.rpcClient.triplestore().query(query)(),
            update: (query: string) =>
                this.rpcClient.triplestore().update(query)(),
        };
    }

    /**
     * It returns a new class that implements the [[PolyOut]] interface
     * @returns A class that implements the [[PolyOut]] interface.
     */
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

    /**
     * It returns an object that implements the [[PolyNav]] interface
     *
     * @returns {PolyNav} A PolyNav object with functions that call the RPC client of the pod.
     */
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

    /**
     * It returns an [[Info]] object of the pod.
     * @returns The `info` property.
     */
    get info(): Info {
        return {
            getRuntime: () => this.rpcClient.info().getRuntime()(),
            getVersion: () => this.rpcClient.info().getVersion()(),
        };
    }

    /**
     * `get endpoint(): Endpoint`
     *
     * @returns The endpoint object of the pod is being returned.
     */
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

/**
 * @class RemoteServerPod @implements [[ServerOf.<[[PodBackend]]>]]
 * It's a wrapper around a Pod that exposes the same API as a Pod,
 * but it's a remote server
 */
export class RemoteServerPod implements ServerOf<PodBackend> {
    /**
     * It creates a new instance of the class.
     * @param {Pod} pod - Pod
     */
    constructor(private readonly pod: Pod) {}

    /**
     * It sets a backendServer as a handler for each incoming message to the port passed.
     * @param port - The port that the backend server will listen on.
     */
    listen(port: ResponsePort<BackendRequest, BackendResponse>): void {
        server(port, backendServer<PodBackend>(this));
    }

    /**
     * It sets up a listening process to the raw port passed.
     * @param rawPort - The port that the server will listen on.
     */
    listenOnRaw(rawPort: Port<Uint8Array, Uint8Array>): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrappedPort = bubblewrapPort(rawPort) as Port<any, any>;
        this.listen(liftServer<BackendRequest, BackendResponse>(wrappedPort));
    }

    /**
     * It returns a middleware function that can be used to handle requests to the pod's bubblewrap
     * @returns {Promise<RequestListener>} A function that takes a request and a response and returns a promise.
     */
    async listenOnMiddleware(): Promise<RequestListener> {
        const { bubblewrapMiddlewarePort } = await import(
            "../port-authority/middleware"
        );
        const [middleware, port] = bubblewrapMiddlewarePort(podBubblewrap, {
            limit: "10mb",
        });
        this.listen(port);
        return middleware;
    }

    /**
     * It returns a server that delegates to the pod that has been provided to the constructor,
     * but it modifies the response of the `fetch` function
     * @returns A server object that has the same methods as the polyOut object.
     */
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

    /**
     * > The `polyIn` function returns a `ServerOf<PolyInBackend>` object
     * @returns A ServerOf<PolyInBackend> - the polyIn instance of the pod
     */
    polyIn(): ServerOf<PolyInBackend> {
        return this.pod.polyIn;
    }

    /**
     * Returns the triplestore backend server of the pod
     *
     * @returns {ServerOf.<TriplestoreBackend>} a server that implements the `TriplestoreBackend` interface
     */
    triplestore(): ServerOf<TriplestoreBackend> {
        return this.pod.triplestore;
    }

    /**
     * > The `polyNav()` function returns a `ServerOf<PolyNavBackend>` object
     * @returns {ServerOf.<PolyNavBackend>} - the polyNav instance of the pod
     */
    polyNav(): ServerOf<PolyNavBackend> {
        return this.pod.polyNav;
    }

    /**
     * It returns a `ServerOf<InfoBackend>` object
     * @returns A ServerOf<InfoBackend> - the info of the pod
     */
    info(): ServerOf<InfoBackend> {
        return this.pod.info;
    }

    /**
     * Return the endpoint server of the pod.
     * @returns A ServerOf<EndpointBackend>
     */
    endpoint(): ServerOf<EndpointBackend> {
        return this.pod.endpoint;
    }
}
