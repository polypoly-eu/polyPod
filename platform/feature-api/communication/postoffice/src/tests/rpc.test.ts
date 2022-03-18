import { backendEndpointClient, backendEndpointServer } from "../rpc";
import { ClientOf, ObjectBackendEndpointSpec, ServerOf, ValueBackendEndpointSpec } from "../types";

type SimpleEndpoint = ObjectBackendEndpointSpec<{
    test1(param1: string): ValueBackendEndpointSpec<number>;
    test2(param1: string): ValueBackendEndpointSpec<number>;
    test3(parama: boolean, ...paramb: number[]): ValueBackendEndpointSpec<string>;
}>;

const simpleEndpointImpl: ServerOf<SimpleEndpoint> = {
    test1: (param1: string) => Promise.resolve(param1.length * 2),
    test2: (param1: string) => param1.length * 2,
    test3: (parama: boolean, ...paramb: number[]) =>
        Promise.reject(new Error(`${parama}, ${paramb.join()}`)),
};

type ComplexEndpoint = ObjectBackendEndpointSpec<{
    simple(): SimpleEndpoint;
}>;

const complexEndpointImpl: ServerOf<ComplexEndpoint> = {
    simple: () => Promise.resolve(simpleEndpointImpl),
};

describe("RPC", () => {
    let rpcClient: ClientOf<ComplexEndpoint>;

    beforeEach(async () => {
        rpcClient = backendEndpointClient<ComplexEndpoint>(
            backendEndpointServer<ComplexEndpoint>(complexEndpointImpl)
        );
    });

    it("Succeeds (simple call)", async () => {
        await expect(rpcClient.simple().test1("hi")()).resolves.toEqual(4);
        await expect(rpcClient.simple().test2("hi")()).resolves.toEqual(4);
    });

    it("Succeeds (nested call)", async () => {
        await expect(rpcClient.simple().test3(true, 0, 1)()).rejects.toThrowError("true, 0,1");
    });

    it("Fails (non-existent method)", async () => {
        // @ts-ignore testing a non-existent method
        await expect(rpcClient.whodis("lol")()).rejects.toThrowError(/not a function/);
    });
});
