import { DefaultPod } from "@polypoly-eu/poly-api";
import { Server } from "http";
import { once } from "events";
import { dataset } from "@rdfjs/dataset";
import { promises as fs } from "fs";
import fetch from "node-fetch";
import { RemoteServerPod } from "../../remote";
import createServer from "connect";
import { assertPod, assets, completion } from "../_bootstrap";
import { JSDOM } from "jsdom";

// <https://github.com/jsdom/jsdom/issues/2961> prevents upgrade to JSDOM 16.x

describe("Bootstrap (JSDOM)", () => {
    const port = 12345;

    let pod: DefaultPod;
    let server: Server;

    beforeEach(async () => {
        const app = createServer();

        pod = new DefaultPod(dataset(), fs as any, fetch);
        const api = await new RemoteServerPod(pod).listenOnMiddleware();
        app.use("/api", api);
        app.use(
            "/assets",
            assets({
                type: "fetch",
                uri: `http://localhost:${port}/api`,
            })
        );

        server = app.listen(port);
        await once(server, "listening");
    });

    afterEach(() => {
        server.close();
    });

    it("http", async function () {
        this.timeout(10000);

        const dom = await JSDOM.fromURL(`http://localhost:${port}/assets/index.html`, {
            runScripts: "dangerously",
            resources: "usable",
        });
        // @ts-ignore
        const finished = completion(dom.window);
        // @ts-ignore
        dom.window.fetch = fetch;

        await finished;
        assertPod(pod);

        dom.window.close();
    });
});
