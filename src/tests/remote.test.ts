import {DefaultPod} from "@polypoly-eu/poly-api";
import {Volume} from "memfs";
import {dataset} from "@rdfjs/dataset";
import {RemoteClientPod, RemoteServerPod} from "../remote";
import {MessageChannel, MessagePort} from "worker_threads";
import {Port, fromNodeMessagePort} from "@polypoly-eu/port-authority";
import {Server} from "http";
import {AddressInfo} from "net";
import express, {Router} from "express";
import {VolatilePod} from "../volatile";
import fetch from "node-fetch";
import {once} from "events";
import {getHttpbinUrl, podSpec} from "@polypoly-eu/poly-api/dist/specs";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("Remote pod", () => {

    describe("MessagePort (node)", () => {

        const ports: MessagePort[] = [];

        podSpec(() => {
            const fs = new Volume().promises as any;
            const {port1, port2} = new MessageChannel();
            ports.push(port1, port2);
            const underlying = new DefaultPod(dataset(), fs, fetch);
            const server = new RemoteServerPod(underlying);
            server.listenOnRaw(fromNodeMessagePort(port2) as Port<Uint8Array, Uint8Array>);
            return RemoteClientPod.fromRawPort(fromNodeMessagePort(port1) as Port<Uint8Array, Uint8Array>);
        }, "/", getHttpbinUrl());

        afterAll(() => {
            ports.forEach(port => port.close());
        });

    });

    describe("Express/fetch", () => {

        const pod: VolatilePod = new VolatilePod(null!);
        let server: Server;
        let port: number;

        beforeAll(async () => {
            const app = express();
            const router = Router();
            app.use("/", router);

            const serverPod = new RemoteServerPod(pod);

            await serverPod.listenOnRouter(router);

            server = app.listen();
            await once(server, "listening");
            port = (server.address() as AddressInfo).port;
        });

        podSpec(() => {
            const fs = new Volume().promises as any;
            pod.pod = new DefaultPod(dataset(), fs, fetch);

            const clientPod = RemoteClientPod.fromFetch(`http://localhost:${port}`, fetch as any);

            return Object.assign(clientPod, { fs });
        }, "/", getHttpbinUrl());

        afterAll(async () => {
            server.close();
            await once(server, "close");
        });

    });

});
