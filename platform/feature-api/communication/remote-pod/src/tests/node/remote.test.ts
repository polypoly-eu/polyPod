import { PolyLifecycle, Pod, DefaultPod, FS } from "@polypoly-eu/pod-api";
import { Volume } from "memfs";
import factory from "@rdfjs/dataset";
import { RemoteClientPod, RemoteServerPod } from "../../remote";
import { MessageChannel, MessagePort } from "worker_threads";
import { Port } from "@polypoly-eu/port-authority";
import { fromNodeMessagePort } from "@polypoly-eu/port-authority";
import { createServer, Server } from "http";
import { once } from "events";
import { podSpec } from "@polypoly-eu/pod-api/dist/spec";
import { getHttpbinUrl } from "@polypoly-eu/test-utils";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("Remote pod", () => {
    describe("MessagePort (node)", () => {
        const ports: MessagePort[] = [];
        const fs = new Volume().promises;
        const { port1, port2 } = new MessageChannel();
        ports.push(port1, port2);
        const underlying = new DefaultPod(factory.dataset(), fs as unknown as FS);
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
            underlying = new DefaultPod(factory.dataset(), fs as unknown as FS);
            const serverPod = new RemoteServerPod(underlying);

            const app = await serverPod.listenOnMiddleware();

            server = createServer(app);
            server.listen(port);
            await once(server, "listening");
        });

        after(async () => {
            server.close();
            await once(server, "close");
        });
    });
});
