import {
    EndpointError,
    EndpointReqRes,
    EndpointRequest,
    EndpointResponse,
    endpointServer,
    endpointTypeson,
} from "../../rpc";
import {makeServer, Port, typesonPort} from "../../ports";
import {messageChannelPortal} from "../../browser/ports-messageport";
import {ComplexEndpoint, fakeComplexEndpointImpl, rpcPortClientSpec} from "../../specs/rpc-port-client";
import {fromFetch} from "../../ports-fetch";

describe("RPC", () => {

    let server: EndpointReqRes;

    beforeAll(() => {
        server = endpointServer<ComplexEndpoint>(fakeComplexEndpointImpl);
    });

    describe("Basic operation", () => {

        it("Succeeds (simple call)", async () => {
            await expectAsync(server(new EndpointRequest([
                { method: "simple", args: [] },
                { method: "test2", args: ["hi"] }
            ]))).toBeResolvedTo(new EndpointResponse(4));
        });

        it("Succeeds (nested call)", async () => {
            await expectAsync(server(new EndpointRequest([
                { method: "simple", args: [] },
                { method: "test3", args: [true, 0, 1] }
            ]))).toBeRejectedWithError("true, 0,1");
        });

        it("Fails (non-existent method)", async () => {
            await expectAsync(server(new EndpointRequest([
                { method: "simple", args: [] },
                { method: "test4", args: ["hi"] }
            ]))).toBeRejectedWith(new EndpointError("test4"));
        });

    });

    describe("Client operation", () => {

        let port: Port;
        let cleanup: () => void;

        beforeAll(async () => {
            const portal = await messageChannelPortal();
            port = portal.port2;
            cleanup = portal.cleanup;
            makeServer(typesonPort(portal.port1, endpointTypeson), server);
        });

        afterAll(() => {
            cleanup();
        });

        rpcPortClientSpec(
            "Client operation",
            () => port
        );

    });

    rpcPortClientSpec(
        "Client operation (through fetch)",
        () => fromFetch("/rpc", window.fetch),
        true
    );

});
