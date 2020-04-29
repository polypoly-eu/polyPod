import {endpointClient, endpointServer} from "../rpc";
import {MessageChannel} from "worker_threads";
import {client, fromNodeMessagePort, liftClient, liftServer, mapPort, Port, server} from "@polypoly-eu/port-authority";
import {Bubblewrap} from "@polypoly-eu/bubblewrap";
import {ClientOf, ObjectEndpointSpec, ServerOf, ValueEndpointSpec} from "../types";
import {endpointBubblewrapClasses, EndpointRequest, EndpointResponse, EndpointError} from "../protocol";

type SimpleEndpoint = ObjectEndpointSpec<{
    test1(param1: string): ValueEndpointSpec<number>;
    test2(param1: string): ValueEndpointSpec<number>;
    test3(parama: boolean, ...paramb: number[]): ValueEndpointSpec<string>;
}>

const simpleEndpointImpl: ServerOf<SimpleEndpoint> = {
    test1: (param1: string) =>
        Promise.resolve(param1.length * 2),
    test2: (param1: string) =>
        param1.length * 2,
    test3: (parama: boolean, ...paramb: number[]) =>
        Promise.reject(new Error(`${parama}, ${paramb.join()}`))
};

type ComplexEndpoint = ObjectEndpointSpec<{
    simple(): SimpleEndpoint;
}>

const complexEndpointImpl: ServerOf<ComplexEndpoint> = {
    simple: () => Promise.resolve(simpleEndpointImpl)
};

describe("RPC", () => {

    let rpcClient: ClientOf<ComplexEndpoint>;
    let cleanup: () => Promise<void>;

    beforeEach(async () => {
        const {port1, port2} = new MessageChannel();

        const bubblewrap = Bubblewrap.create(endpointBubblewrapClasses);

        const rawClientPort = fromNodeMessagePort(port1) as Port<Uint8Array, Uint8Array>;
        const rawServerPort = fromNodeMessagePort(port2) as Port<Uint8Array, Uint8Array>;

        const clientPort = liftClient<EndpointRequest, EndpointResponse>(
            mapPort(rawClientPort, buffer => bubblewrap.decode(buffer), request => bubblewrap.encode(request))
        );

        const serverPort = liftServer<EndpointRequest, EndpointResponse>(
            mapPort(rawServerPort, buffer => bubblewrap.decode(buffer), response => bubblewrap.encode(response))
        );

        rpcClient = endpointClient<ComplexEndpoint>(client(clientPort));
        server(serverPort, endpointServer<ComplexEndpoint>(complexEndpointImpl));

        cleanup = async () => {
            port1.close();
            port2.close();
        }
    });

    afterEach(async () => {
        await cleanup();
    });

    it("Succeeds (simple call)", async () => {
        await expect(rpcClient.call.simple().call.test1("hi").get).resolves.toEqual(4);
        await expect(rpcClient.call.simple().call.test2("hi").get).resolves.toEqual(4);
    });

    it("Succeeds (nested call)", async () => {
        await expect(rpcClient.call.simple().call.test3(true, 0, 1).get)
            .rejects.toThrowError("true, 0,1");
    });

    it("Fails (non-existent method)", async () => {
        // @ts-ignore
        await expect(rpcClient.call.whodis("lol").get)
            .rejects.toThrowError(EndpointError);
    });

});

