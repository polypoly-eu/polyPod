import {nodeLoopbackLifecycle} from "./_common";
import {procedureSpec, ProcedureSpecLifecycle} from "../../specs/procedure";
import {procedureLiftedLifecycle} from "../_lifecycles";
import {jsonFetchPort} from "../../fetch";
import express, {Router} from "express";
import {json} from "body-parser";
import {jsonRouterPort} from "../../node";
import {Server} from "http";
import {AddressInfo} from "net";
// @ts-ignore
import fetch from "node-fetch";

const httpLifecycle: ProcedureSpecLifecycle = async <T, U> () => {
    const app = express();

    const router = Router();
    router.use("/", json({
        type: "application/json",
        strict: false
    }));
    const receive = jsonRouterPort(router);

    app.use(router);

    const server = await new Promise<Server>(resolve => {
        const server = app.listen();
        server.once("listening", () => resolve(server));
    });

    const port = (server.address() as AddressInfo).port;

    const send = jsonFetchPort(
        `http://localhost:${port}/`,
        fetch
    );

    return {
        value: [send, receive],
        cleanup: () => new Promise(resolve => {
            server.close(() => resolve());
        })
    };
};

describe("Node/Procedure", () => {

    describe("lifted", () => {

        procedureSpec(procedureLiftedLifecycle(nodeLoopbackLifecycle));

    });

    describe("express/fetch", () => {

        procedureSpec(httpLifecycle);

    });

});
