import { DefaultPod, FS } from "@polypoly-eu/pod-api";
import { IncomingMessage, ServerResponse, RequestListener, Server } from "http";
import { once } from "events";
import { dataset } from "@rdfjs/dataset";
import { promises as fs } from "fs";
import fetch from "node-fetch";
import http from "http";
import { RemoteServerPod } from "../../remote";
import { iframeOuterPort } from "@polypoly-eu/port-authority";
import { dataFactory } from "@polypoly-eu/rdf";
import { assert } from "chai";
import createServer from "connect";
import { join } from "path";

function assertPod(pod: DefaultPod): void {
    const expectedQuad = dataFactory.quad(
        dataFactory.namedNode("http://example.org/s"),
        dataFactory.namedNode("http://example.org/p"),
        dataFactory.namedNode("http://example.org/o")
    );

    assert.equal(pod.store.size, 1);
    assert.isTrue(pod.store.has(expectedQuad));
}

function completion(_window: Window): Promise<void> {
    return new Promise((resolve) => {
        _window.addEventListener("message", (event) => {
            if (event.data === "completed") resolve();
        });
    });
}

function assets(): RequestListener {
    const app = createServer();
    app.use("/feature.js", async (request: IncomingMessage, response: ServerResponse) => {
        response.setHeader("Content-Type", "text/javascript");
        response.writeHead(200);
        response.write(await fs.readFile(join(__dirname, "../data/feature.js")));
        response.end();
    });
    app.use("/pod.js", async (request: IncomingMessage, response: ServerResponse) => {
        response.setHeader("Content-Type", "text/javascript");
        response.writeHead(200);
        response.write(await fs.readFile(join(__dirname, "../../../dist/bootstrap.js")));
        response.end();
    });
    app.use("/index.html", (request: IncomingMessage, response: ServerResponse) => {
        response.setHeader("Content-Type", "text/html");
        response.writeHead(200);
        response.write(`
            <!DOCTYPE HTML>
            <html>
                <body>
                    <script src="pod.js"></script>
                    <script src="feature.js"></script>
                </body>
            </html>
        `);
        response.end();
    });
    return app;
}

describe("Bootstrap (Electron)", () => {
    const port = 12345;

    let pod: DefaultPod;
    let server: Server;

    beforeEach(async () => {
        pod = new DefaultPod(dataset(), fs as unknown as FS, fetch);
        const app = assets();

        server = http.createServer(app);
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
