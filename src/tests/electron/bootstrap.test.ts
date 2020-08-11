import { DefaultPod } from "@polypoly-eu/poly-api";
import { Server } from "http";
import { once } from "events";
import { dataset } from "@rdfjs/dataset";
import { promises as fs } from "fs";
import fetch from "node-fetch";
import { assertPod, assets, completion } from "../_bootstrap";
import { createServer } from "http";
import { RemoteServerPod } from "../../remote";
import { iframeOuterPort } from "@polypoly-eu/port-authority";

describe("Bootstrap (Electron)", () => {
    const port = 12345;

    let pod: DefaultPod;
    let server: Server;

    beforeEach(async () => {
        pod = new DefaultPod(dataset(), fs as any, fetch);
        const app = assets();

        server = createServer(app);
        server.listen(port);
        await once(server, "listening");
    });

    afterEach(() => {
        server.close();
    });

    it("iframe", async function () {
        this.timeout(10000);

        const body = document.querySelector("body")!;
        const iframe = document.createElement("iframe");
        iframe.setAttribute("sandbox", "allow-scripts");
        iframe.setAttribute("src", `http://localhost:${port}/index.html`);
        iframe.onload = () => {
            new RemoteServerPod(pod).listenOnRaw(iframeOuterPort("", iframe));
        };

        const finished = completion(window);

        body.appendChild(iframe);

        await finished;

        assertPod(pod);
    });
});
