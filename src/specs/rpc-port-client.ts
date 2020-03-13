import {
    ClientOf,
    endpointClient,
    EndpointError,
    EndpointReqRes, endpointTypeson,
    ObjectEndpointSpec,
    ServerOf,
    ValueEndpointSpec
} from "../rpc";
import {makeClient, Port, typesonPort} from "../ports";
import {FSEndpoint} from "../endpoints/node-fs";

export type SimpleEndpoint = ObjectEndpointSpec<{
    test1(param1: string): ValueEndpointSpec<number>;
    test2(param1: string): ValueEndpointSpec<number>;
    test3(parama: boolean, ...paramb: number[]): ValueEndpointSpec<string>;
}>

export const simpleEndpointImpl: ServerOf<SimpleEndpoint> = {
    test1: (param1: string) =>
        Promise.resolve(param1.length * 2),
    test2: (param1: string) =>
        param1.length * 2,
    test3: (parama: boolean, ...paramb: number[]) =>
        Promise.reject(new Error(`${parama}, ${paramb.join()}`))
};

export type ComplexEndpoint = ObjectEndpointSpec<{
    simple(): SimpleEndpoint;
    fs(): FSEndpoint;
}>

export const fakeComplexEndpointImpl: ServerOf<ComplexEndpoint> = {
    simple: () => Promise.resolve(simpleEndpointImpl),
    fs: () => Promise.reject(new Error("not implemented"))
};

class RpcPortClientSpec {

    constructor(
        private readonly name: string,
        private readonly port: () => Port,
        private readonly checkFS: boolean
    ) {}

    run(): void {
        describe(this.name, () => {
            let client: ClientOf<ComplexEndpoint>;

            beforeEach(() => {
                const reqres: EndpointReqRes = makeClient(typesonPort(this.port(), endpointTypeson));
                client = endpointClient<ComplexEndpoint>(reqres);
            });

            it("Succeeds (simple call)", async () => {
                await expectAsync(client.call.simple().call.test1("hi").get).toBeResolvedTo(4);
                await expectAsync(client.call.simple().call.test2("hi").get).toBeResolvedTo(4);
            });

            it("Succeeds (nested call)", async () => {
                await expectAsync(client.call.simple().call.test3(true, 0, 1).get)
                    .toBeRejectedWithError("true, 0,1");
            });

            it("Fails (non-existent method)", async () => {
                // @ts-ignore
                await expectAsync(client.call.whodis("lol").get)
                    .toBeRejectedWith(new EndpointError("whodis"));
            });

            this.checkFS && it("Filesystem API", async () => {
                await expectAsync(client.call.fs().call.readFile("/test", { encoding: "utf8" }).get)
                    .toBeResolvedTo("file-content");

                await expectAsync(client.call.fs().call.readFile("/test-nonexistent", { encoding: "utf8" }).get)
                    .toBeRejectedWithError(/ENOENT/);
            });
        });
    }

}

export function rpcPortClientSpec(name: string, port: () => Port, checkFS?: true): void {
    new RpcPortClientSpec(name, port, checkFS || false).run();
}