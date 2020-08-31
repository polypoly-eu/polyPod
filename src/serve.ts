import type { Server, ServerResponse } from "http";
import { once } from "events";
import type { Pod } from "@polypoly-eu/poly-api";
import { RemoteServerPod } from "@polypoly-eu/podigree";
import { join } from "path";
import type { Manifest } from "@polypoly-eu/customs";
import createServer, { IncomingMessage, NextHandleFunction } from "connect";
import serveStatic from "serve-static";
import { promises as fs } from "fs";

export async function serve(
    port: number,
    pod: Pod,
    rootDir: string,
    manifest: Manifest
): Promise<Server> {
    const app = createServer();

    const bootstrap = await fs.readFile(
        require.resolve("@polypoly-eu/podigree/dist/bootstrap.js"),
        "utf-8"
    );

    const container = await fs.readFile(join(__dirname, "../dist/container.js"), "utf-8");

    const html = await fs.readFile(join(__dirname, "../data/container.html"), "utf-8");

    // FIXME enable csp

    app.use("/rpc", await new RemoteServerPod(pod).listenOnMiddleware());
    app.use("/container.js", async (request: IncomingMessage, response: ServerResponse) => {
        response.setHeader("Content-Type", "text/javascript");
        response.end(container);
    });
    app.use("/pod.js", async (request: IncomingMessage, response: ServerResponse) => {
        response.setHeader("Content-Type", "text/javascript");
        response.end(bootstrap);
    });
    app.use("/feature", serveStatic(join(rootDir, manifest.root)) as NextHandleFunction);
    app.use("/", async (request: IncomingMessage, response: ServerResponse) => {
        if (request.url === "/") {
            response.setHeader("Content-Type", "text/html");
            response.end(html);
        } else {
            response.statusCode = 404;
            response.end();
        }
    });

    const server = app.listen(port);
    await once(server, "listening");
    return server;
}
