import {Pod, PolyIn, PolyOut} from "@polypoly-eu/poly-api";
import {DataFactory} from "rdf-js";
import {endpointClient, ClientOf, ServerOf, EndpointRequest, EndpointResponse, endpointServer} from "@polypoly-eu/postoffice";
import {FetchResponse, PodEndpoint, PolyInEndpoint, PolyOutEndpoint} from "./endpoints";
import {ReceiveAndReplyPort, liftServer, server, bubblewrapFetchPort, SendAndReplyPort, client, Port, liftClient, bubblewrapRouterPort} from "@polypoly-eu/port-authority";
import {podBubblewrap, dataFactory, bubblewrapPort} from "./bubblewrap";
import {Router} from "express";
import {bindFS} from "../util";

export class RemoteClientPod implements Pod {

    private readonly rpcClient: ClientOf<PodEndpoint>;

    static fromFetch(url: string, fetch: typeof window.fetch = window.fetch): RemoteClientPod {
        const port = bubblewrapFetchPort(
            url,
            podBubblewrap,
            fetch
        );

        return new RemoteClientPod(port, dataFactory);
    }

    static fromRawPort(rawPort: Port<Uint8Array, Uint8Array>): RemoteClientPod {
        return new RemoteClientPod(liftClient(bubblewrapPort(rawPort)), dataFactory);
    }

    constructor(
        private clientPort: SendAndReplyPort<EndpointRequest, EndpointResponse>,
        private readonly dataFactory: DataFactory
    ) {
        this.rpcClient = endpointClient<PodEndpoint>(client(clientPort));
    }

    get polyIn(): PolyIn {
        return {
            factory: this.dataFactory,
            add: (...quads) => this.rpcClient.call.polyIn().call.add(...quads).get,
            select: matcher => this.rpcClient.call.polyIn().call.select(matcher).get
        };
    }

    get polyOut(): PolyOut {
        return {
            readFile: (path, options) =>
                this.rpcClient.call.polyOut().call.readFile(path, options).get,
            writeFile: (path, contents, options) =>
                this.rpcClient.call.polyOut().call.writeFile(path, contents, options).get,
            stat: path =>
                this.rpcClient.call.polyOut().call.stat(path).get,
            fetch: (input, init) =>
                // we need to `|| {}` here because the msgpack library (via bubblewrap) maps `undefined` to `null`,
                // which confuses some fetch implementations
                this.rpcClient.call.polyOut().call.fetch(input, init || {}).get
        };
    }

}

export class RemoteServerPod implements ServerOf<PodEndpoint> {

    constructor(
        private readonly pod: Pod
    ) {}

    listen(port: ReceiveAndReplyPort<EndpointRequest, EndpointResponse>): void {
        server(port, endpointServer<PodEndpoint>(this));
    }

    listenOnRaw(rawPort: Port<Uint8Array, Uint8Array>): void {
        this.listen(liftServer<EndpointRequest, EndpointResponse>(bubblewrapPort(rawPort)));
    }

    async listenOnRouter(router: Router): Promise<void> {
        this.listen(await bubblewrapRouterPort(
            router,
            podBubblewrap,
            { limit: "10mb" }
        ));
    }

    polyOut(): ServerOf<PolyOutEndpoint> {
        const polyOut = this.pod.polyOut;

        return {
            fetch: async (input, init) => FetchResponse.of(await polyOut.fetch(input, init)),
            ...bindFS(polyOut)
        };
    }

    polyIn(): ServerOf<PolyInEndpoint> {
        return this.pod.polyIn;
    }

}
