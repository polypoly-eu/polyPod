import type { Server, ServerResponse } from "http";
import { once } from "events";
import type { Pod } from "@polypoly-eu/pod-api";
import { RemoteServerPod } from "@polypoly-eu/remote-pod";
import { join } from "path";
import type { Manifest } from "@polypoly-eu/manifest-parser";
import createServer, { IncomingMessage, NextHandleFunction } from "connect";
import serveStatic from "serve-static";
import { promises as fs } from "fs";
import { render } from "ejs";
import cors from "cors";

export async function serve(
    port: number,
    rootDir: string,
    manifest: Manifest,
    pod?: Pod
): Promise<Server> {
    const app = createServer();

    if (pod) app.use("/rpc", await new RemoteServerPod(pod).listenOnMiddleware());

    app.use(cors());
    app.use("/container.js", async (request: IncomingMessage, response: ServerResponse) => {
        const container = await fs.readFile(join(__dirname, "../dist/container.js"), "utf-8");
        response.setHeader("Content-Type", "text/javascript");
        response.end(container);
    });
    app.use("/feature/pod.js", async (request: IncomingMessage, response: ServerResponse) => {
        const bootstrap = await fs.readFile(
            require.resolve("@polypoly-eu/remote-pod/dist/bootstrap.js"),
            "utf-8"
        );
        response.setHeader("Content-Type", "text/javascript");
        response.end(bootstrap);
    });
    app.use("/feature", serveStatic(join(rootDir, "")) as NextHandleFunction);
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
