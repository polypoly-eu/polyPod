import {nodeLoopbackLifecycle} from "./_common";
import {procedureSpec, ProcedureSpecLifecycle} from "../../specs/procedure";
import {procedureLiftedLifecycle} from "../_lifecycles";
import {bubblewrapFetchPort, jsonFetchPort} from "../../fetch";
import express, {Express, Router} from "express";
import {bubblewrapRouterPort, jsonRouterPort} from "../../node";
import {Server} from "http";
import {AddressInfo} from "net";
import {Bubblewrap} from "@polypoly-eu/bubblewrap";
// @ts-ignore
import fetch from "node-fetch";

async function startServer(app: Express): Promise<[Server, number]> {
    const server = await new Promise<Server>(resolve => {
        const server = app.listen();
        server.once("listening", () => resolve(server));
    });

    const port = (server.address() as AddressInfo).port;

    return [server, port];
}

function stopServer(server: Server): Promise<void> {
    return new Promise(resolve => {
        server.close(() => resolve());
    });
}

const jsonHttpLifecycle: ProcedureSpecLifecycle = async () => {
    const app = express();

    const router = Router();
    const receive = jsonRouterPort(router);

    app.use(router);

    const [server, port] = await startServer(app);

    const send = jsonFetchPort(
        `http://localhost:${port}/`,
        fetch
    );

    return {
        value: [send, receive],
        cleanup: () => stopServer(server)
    };
};

const rawHttpLifecycle: ProcedureSpecLifecycle = async () => {
    const bubblewrap = Bubblewrap.create();

    const app = express();

    const router = Router();
    const receive = bubblewrapRouterPort(router, bubblewrap);

    app.use(router);

    const [server, port] = await startServer(app);

    const send = bubblewrapFetchPort(
        `http://localhost:${port}/`,
        bubblewrap,
        fetch
    );

    return {
        value: [send, receive],
        cleanup: () => stopServer(server)
    };
};

describe("Node/Procedure", () => {

    describe("lifted", () => {

        procedureSpec(procedureLiftedLifecycle(nodeLoopbackLifecycle));

    });

    describe("express/fetch (JSON)", () => {

        procedureSpec(jsonHttpLifecycle);

    });

    describe("express/fetch (Uint8Array)", () => {

        procedureSpec(rawHttpLifecycle);

    });

});
