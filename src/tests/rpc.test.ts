import {
    ClientOf,
    endpointBubblewrapClasses,
    endpointClient,
    EndpointError,
    EndpointRequest,
    EndpointResponse,
    endpointServer,
    ObjectEndpointSpec,
    ServerOf,
    ValueEndpointSpec
} from "../rpc";
import {MessageChannel} from "worker_threads";
import {client, fromNodeMessagePort, liftClient, liftServer, mapPort, Port, server} from "@polypoly-eu/port-authority";
import {Bubblewrap} from "@polypoly-eu/bubblewrap";

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

// compilation tests

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function check<T>(t: T): void { /* intentionally left blank */ }

declare const client1: ClientOf<ValueEndpointSpec<number>>;
declare const client2: ClientOf<ValueEndpointSpec<Promise<number>>>;
declare const client3: ClientOf<ObjectEndpointSpec<{
    test(): ValueEndpointSpec<number>;
}>>;
declare const client4: ClientOf<ObjectEndpointSpec<{
    test(): ObjectEndpointSpec<{
        test2(): ValueEndpointSpec<number>;
    }>;
}>>;
declare const server1: number;
declare const server2: Promise<number>;
declare const server3: {
    test(): Promise<number>;
};
declare const server4: {
    test(): {
        test2(): number;
    };
};
declare const server5: {
    test(): Promise<{
        test2(): number;
    }>;
};
declare const server6: {
    test(): Promise<{
        test2(): Promise<number>;
    }>;
};

check(() => {
    check<Promise<number>>(client1.get);

    check<Promise<number>>(client2.get);

    check<ClientOf<ValueEndpointSpec<number>>>(client3.call.test());
    check<Promise<number>>(client3.call.test().get);

    check<Promise<number>>(client4.call.test().call.test2().get);

    check<ServerOf<ValueEndpointSpec<number>>>(server1);

    check<ServerOf<ValueEndpointSpec<number>>>(server2);

    check<ServerOf<ObjectEndpointSpec<{
        test(): ValueEndpointSpec<number>;
    }>>>(server3);

    check<ServerOf<ObjectEndpointSpec<{
        test(): ObjectEndpointSpec<{
            test2(): ValueEndpointSpec<number>;
        }>;
    }>>>(server4);

    check<ServerOf<ObjectEndpointSpec<{
        test(): ObjectEndpointSpec<{
            test2(): ValueEndpointSpec<number>;
        }>;
    }>>>(server5);

    check<ServerOf<ObjectEndpointSpec<{
        test(): ObjectEndpointSpec<{
            test2(): ValueEndpointSpec<number>;
        }>;
    }>>>(server6);
});
