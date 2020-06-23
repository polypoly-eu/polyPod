import {RequestInit, Response, Pod, PolyIn, PolyOut, EncodingOptions} from "@polypoly-eu/poly-api";
import {DataFactory} from "rdf-js";
import {endpointClient, ClientOf, ServerOf, EndpointRequest, EndpointResponse, endpointServer} from "@polypoly-eu/postoffice";
import {FetchResponse, PodEndpoint, PolyInEndpoint, PolyOutEndpoint} from "./endpoints";
import {ResponsePort, liftServer, server, bubblewrapFetchPort, RequestPort, client, Port, liftClient, bubblewrapRouterPort} from "@polypoly-eu/port-authority";
import {podBubblewrap, dataFactory, bubblewrapPort} from "./bubblewrap";
import {Router} from "express";

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
        private clientPort: RequestPort<EndpointRequest, EndpointResponse>,
        public readonly dataFactory: DataFactory
    ) {
        this.rpcClient = endpointClient<PodEndpoint>(client(clientPort));
    }

    get polyIn(): PolyIn {
        return {
            add: (...quads) => this.rpcClient.polyIn().add(...quads)(),
            select: matcher => this.rpcClient.polyIn().select(matcher)()
        };
    }

    get polyOut(): PolyOut {
        const {rpcClient} = this;

        return new class implements PolyOut {
            fetch(input: string, init?: RequestInit): Promise<Response> {
                return rpcClient.polyOut().fetch(input, init || {})();
            }

            readFile(path: string, options: EncodingOptions): Promise<string>;
            readFile(path: string): Promise<Uint8Array>;
            readFile(path: string, options?: EncodingOptions): Promise<string | Uint8Array> {
                if (options === undefined)
                    return rpcClient.polyOut().readFile(path)();
                else
                    return rpcClient.polyOut().readFile(path, options)();
            }

            readdir(path: string): Promise<string[]> {
                return rpcClient.polyOut().readdir(path)();
            }

            stat(path: string): Promise<void> {
                return rpcClient.polyOut().stat(path)();
            }

            writeFile(path: string, content: string, options: EncodingOptions): Promise<void> {
                return rpcClient.polyOut().writeFile(path, content, options)();
            }

        };
    }

}

export class RemoteServerPod implements ServerOf<PodEndpoint> {

    constructor(
        private readonly pod: Pod
    ) {}

    listen(port: ResponsePort<EndpointRequest, EndpointResponse>): void {
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

        // the following implementation delegates strictly to the pod that has been provided to the constructor
        // the only difference is that `fetch` needs to return a slightly modified response

        return {
            fetch: async (input, init) => {
                const response = await polyOut.fetch(input, init);
                return FetchResponse.of(response);
            },
            readFile: (path, options?) => {
                if (options === undefined)
                    return polyOut.readFile(path);
                else
                    return polyOut.readFile(path, options);
            },
            readdir: path => polyOut.readdir(path),
            stat: path => polyOut.stat(path),
            writeFile: (path, content, options) => polyOut.writeFile(path, content, options)
        };
    }

    polyIn(): ServerOf<PolyInEndpoint> {
        return this.pod.polyIn;
    }

}
