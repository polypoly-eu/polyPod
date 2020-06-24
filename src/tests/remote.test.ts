import {DefaultPod} from "@polypoly-eu/poly-api";
import {Volume} from "memfs";
import {dataset} from "@rdfjs/dataset";
import {RemoteClientPod, RemoteServerPod} from "../remote";
import {MessageChannel, MessagePort} from "worker_threads";
import {Port} from "@polypoly-eu/port-authority";
import {fromNodeMessagePort} from "@polypoly-eu/port-authority/dist/node";
import {createServer, Server} from "http";
import fetch from "node-fetch";
import {once} from "events";
import {getHttpbinUrl, podSpec} from "@polypoly-eu/poly-api/dist/spec";

describe("Remote pod", () => {

    describe("MessagePort (node)", () => {

        const ports: MessagePort[] = [];
        const fs = new Volume().promises as any;
        const {port1, port2} = new MessageChannel();
        ports.push(port1, port2);
        const underlying = new DefaultPod(dataset(), fs, fetch);
        const server = new RemoteServerPod(underlying);
        server.listenOnRaw(fromNodeMessagePort(port2) as Port<Uint8Array, Uint8Array>);

        podSpec(RemoteClientPod.fromRawPort(fromNodeMessagePort(port1) as Port<Uint8Array, Uint8Array>), "/", getHttpbinUrl());

        afterAll(() => {
            ports.forEach(port => port.close());
        });

    });

    describe("HTTP/fetch", () => {

        const fs = new Volume().promises as any;
        const port = 12345;

        let server: Server;

        beforeAll(async () => {
            const backendPod = new DefaultPod(dataset(), fs, fetch);
            const serverPod = new RemoteServerPod(backendPod);

            const app = await serverPod.listenOnMiddleware();

            server = createServer(app);
            server.listen(port);
            await once(server, "listening");
        });

        podSpec(
            RemoteClientPod.fromFetch(`http://localhost:${port}`, fetch as any),
            "/",
            getHttpbinUrl()
        );

        afterAll(async () => {
            server.close();
            await once(server, "close");
        });

    });

});
