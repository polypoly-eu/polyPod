import type { Server, ServerResponse } from "http";
import { once } from "events";
import type { Pod } from "@polypoly-eu/poly-api";
import { RemoteServerPod } from "@polypoly-eu/podigree";
import { join } from "path";
import type { Manifest } from "@polypoly-eu/customs";
import createServer, { IncomingMessage, NextHandleFunction } from "connect";
import serveStatic from "serve-static";
import { promises as fs } from "fs";
import { render } from "ejs";

export async function serve(
    port: number,
    rootDir: string,
    manifest: Manifest,
    pod?: Pod
): Promise<Server> {
    const app = createServer();

    if (pod) app.use("/rpc", await new RemoteServerPod(pod).listenOnMiddleware());

    app.use("/container.js", async (request: IncomingMessage, response: ServerResponse) => {
        const container = await fs.readFile(join(__dirname, "../dist/container.js"), "utf-8");
        response.setHeader("Content-Type", "text/javascript");
        response.end(container);
    });
    app.use("/pod.js", async (request: IncomingMessage, response: ServerResponse) => {
        const bootstrap = await fs.readFile(
            require.resolve("@polypoly-eu/podigree/dist/bootstrap.js"),
            "utf-8"
        );
        response.setHeader("Content-Type", "text/javascript");
        response.end(bootstrap);
    });
    app.use("/feature", serveStatic(join(rootDir, manifest.root)) as NextHandleFunction);
    app.use("/", async (request: IncomingMessage, response: ServerResponse) => {
        if (request.url === "/") {
            const template = await fs.readFile(
                join(__dirname, "../data/container.html.ejs"),
                "utf-8"
            );
            const html = render(template, {
                pod: pod ? "rpc" : "browser",
            });
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
