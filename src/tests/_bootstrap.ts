import { dataFactory } from "@polypoly-eu/rdf";
import { DefaultPod } from "@polypoly-eu/poly-api";
import { assert } from "chai";
import { IncomingMessage, ServerResponse, RequestListener } from "http";
import createServer from "connect";
import { promises as fs } from "fs";
import { join } from "path";
import { RemoteClientSpec } from "../bootstrap";

export function assertPod(pod: DefaultPod): void {
    const expectedQuad = dataFactory.quad(
        dataFactory.namedNode("http://example.org/s"),
        dataFactory.namedNode("http://example.org/p"),
        dataFactory.namedNode("http://example.org/o")
    );

    assert.equal(pod.store.size, 1);
    assert.isTrue(pod.store.has(expectedQuad));
}

export function completion(_window: Window): Promise<void> {
    return new Promise((resolve) => {
        _window.addEventListener("message", (event) => {
            if (event.data === "completed") resolve();
        });
    });
}

export function assets(spec?: RemoteClientSpec): RequestListener {
    const app = createServer();
    app.use("/feature.js", async (request: IncomingMessage, response: ServerResponse) => {
        response.setHeader("Content-Type", "text/javascript");
        response.writeHead(200);
        response.write(await fs.readFile(join(__dirname, "data", "feature.js")));
        response.end();
    });
    app.use("/pod.js", async (request: IncomingMessage, response: ServerResponse) => {
        response.setHeader("Content-Type", "text/javascript");
        response.writeHead(200);
        response.write(await fs.readFile(join(__dirname, "..", "..", "dist", "bootstrap.js")));
        response.end();
    });
    app.use("/index.html", (request: IncomingMessage, response: ServerResponse) => {
        response.setHeader("Content-Type", "text/html");
        if (spec !== undefined) {
            const cookie = encodeURIComponent(JSON.stringify(spec));
            response.setHeader("Set-Cookie", `polypoly-bootstrap=${cookie}`);
        }
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
