import { nodeLoopbackLifecycle } from "./_common";
import { procedureSpec, ProcedureSpecLifecycle } from "../../specs/procedure";
import { procedureLiftedLifecycle } from "../_lifecycles";
import { bubblewrapFetchPort, jsonFetchPort } from "../../fetch";
import { bubblewrapMiddlewarePort, jsonMiddlewarePort } from "../../node";
import { createServer, RequestListener, Server } from "http";
import { AddressInfo } from "net";
import { Bubblewrap } from "@polypoly-eu/bubblewrap";

// @ts-ignore
import fetch from "node-fetch";

async function startServer(app: RequestListener): Promise<[Server, number]> {
    const server = createServer(app);

    await new Promise((resolve) => {
        server.listen();
        server.once("listening", () => resolve(server));
    });

    const port = (server.address() as AddressInfo).port;

    return [server, port];
}

function stopServer(server: Server): Promise<void> {
    return new Promise((resolve) => {
        server.close(() => resolve());
    });
}

const jsonHttpLifecycle: ProcedureSpecLifecycle = async () => {
    const [app, receive] = jsonMiddlewarePort();
    const [server, port] = await startServer(app);

    const send = jsonFetchPort(`http://localhost:${port}/`, fetch);

    return {
        value: [send, receive],
        cleanup: () => stopServer(server),
    };
};

const rawHttpLifecycle: ProcedureSpecLifecycle = async () => {
    const bubblewrap = Bubblewrap.create();

    const [app, receive] = bubblewrapMiddlewarePort(bubblewrap);
    const [server, port] = await startServer(app);

    const send = bubblewrapFetchPort(`http://localhost:${port}/`, bubblewrap, fetch);

    return {
        value: [send, receive],
        cleanup: () => stopServer(server),
    };
};

describe("Node/Procedure", () => {
    describe("lifted", () => {
        procedureSpec(procedureLiftedLifecycle(nodeLoopbackLifecycle));
    });

    describe("HTTP/fetch (JSON)", () => {
        procedureSpec(jsonHttpLifecycle);
    });

    describe("HTTP/fetch (Uint8Array)", () => {
        procedureSpec(rawHttpLifecycle);
    });

    describe("GET", () => {
        let server: Server;
        let port: number;

        beforeEach(async () => {
            const [app] = jsonMiddlewarePort();
            const [_server, _port] = await startServer(app);
            server = _server;
            port = _port;
        });

        it("supports GET", async () => {
            const response = await fetch(`http://localhost:${port}/`);
            expect(response.ok).toBe(true);
        });

        afterEach(async () => {
            await stopServer(server);
        });
    });
});
