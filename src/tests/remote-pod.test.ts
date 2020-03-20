import {MockPod, podSpec} from "@polypoly-eu/poly-api";
import {Volume} from "memfs";
import {Server} from "http";
import express from "express";
import {router} from "../pod/express";
import {once} from "events";
import {remotePod} from "../pods/remote-pod";
import {fromFetch} from "@polypoly-eu/postoffice";
import {dataFactory} from "@polypoly-eu/rdf";
import {AddressInfo} from "net";
// @ts-ignore
import fetch from "node-fetch";
import {VolatilePod} from "../pods/volatile-pod";

describe("Remote pod", () => {

    const volatile = new VolatilePod(null!);

    let server: Server;
    let port: number;

    beforeAll(async () => {
        const app = express();
        app.use("/rpc", router(volatile));
        server = app.listen(0);
        await once(server, "listening");
        port = (server.address() as AddressInfo).port;
    });

    describe("Spec", () => {
        podSpec(() => {
            const fs = new Volume().promises as any;
            volatile.pod = new MockPod(fs, fetch);
            const pod = remotePod(fromFetch(`http://localhost:${port}/rpc`, fetch), dataFactory);
            return Object.assign(pod, { fs });
        });
    });

    afterAll(async () => {
        server.close();
        await once(server, "close");
    });

});
