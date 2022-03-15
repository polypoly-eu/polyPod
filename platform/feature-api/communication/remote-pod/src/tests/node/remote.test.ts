import { PolyLifecycle, Pod, DefaultPod, FS } from "@polypoly-eu/pod-api";
import { Volume } from "memfs";
import { dataset } from "@rdfjs/dataset";
import { RemoteClientPod, RemoteServerPod } from "../../remote";
import { MessageChannel, MessagePort } from "worker_threads";
import { Port } from "@polypoly-eu/port-authority";
import { fromNodeMessagePort } from "@polypoly-eu/port-authority/dist/node";
import { createServer, Server } from "http";
import fetch from "node-fetch";
import { once } from "events";
import { podSpec } from "@polypoly-eu/pod-api/dist/spec";
import { getHttpbinUrl } from "@polypoly-eu/fetch-spec";
import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("Remote pod", () => {
    describe("MessagePort (node)", () => {
        const ports: MessagePort[] = [];
        const fs = new Volume().promises;
        const { port1, port2 } = new MessageChannel();
        ports.push(port1, port2);
        const underlying = new DefaultPod(dataset(), fs as unknown as FS, fetch);
        const server = new RemoteServerPod(underlying);
        server.listenOnRaw(fromNodeMessagePort(port2) as Port<Uint8Array, Uint8Array>);

        podSpec(
            RemoteClientPod.fromRawPort(fromNodeMessagePort(port1) as Port<Uint8Array, Uint8Array>),
            "/",
            getHttpbinUrl()
        );

        after(() => {
            ports.forEach((port) => port.close());
        });
    });

    describe("HTTP/fetch", () => {
        const fs = new Volume().promises;
        const port = 12345;
        let underlying: Pod;

        let server: Server;

        before(async () => {
            underlying = new DefaultPod(dataset(), fs as unknown as FS, fetch);
            const serverPod = new RemoteServerPod(underlying);

            const app = await serverPod.listenOnMiddleware();

            server = createServer(app);
            server.listen(port);
            await once(server, "listening");
        });

        podSpec(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            RemoteClientPod.fromFetch(`http://localhost:${port}`, fetch as any),
            "/",
            getHttpbinUrl()
        );

        // TODO move to api
        describe("Lifecycle", () => {
            let log: Array<(string | boolean)[]>;

            beforeEach(() => {
                log = [];
                const polyLifecycle: PolyLifecycle = {
                    startFeature: async (...args) => {
                        log.push(args);
                    },
                    listFeatures: async () => ({ "test-on": true, "test-off": false }),
                };
                Object.assign(underlying, { polyLifecycle });
            });

            it("Lists features", async () => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const client = RemoteClientPod.fromFetch(`http://localhost:${port}`, fetch as any);
                await assert.eventually.deepEqual(client.polyLifecycle.listFeatures(), {
                    "test-on": true,
                    "test-off": false,
                });
            });

            it("Starts feature", async () => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const client = RemoteClientPod.fromFetch(`http://localhost:${port}`, fetch as any);
                await client.polyLifecycle.startFeature("hi", false);
                await client.polyLifecycle.startFeature("yo", true);
                assert.deepEqual(log, [
                    ["hi", false],
                    ["yo", true],
                ]);
            });
        });

        after(async () => {
            server.close();
            await once(server, "close");
        });
    });
});
