import type { Server, ServerResponse } from "http";
import { once } from "events";
import type { Pod } from "@polypoly-eu/poly-api";
import { RemoteServerPod } from "@polypoly-eu/podigree";
import { join } from "path";
import type { Manifest } from "@polypoly-eu/customs";
import type { RemoteClientSpec } from "@polypoly-eu/podigree/dist/bootstrap";
import createServer, { IncomingMessage, NextHandleFunction } from "connect";
import serveStatic from "serve-static";
import { promises as fs } from "fs";

export function cookieMiddleware(uri: string): NextHandleFunction {
    const spec: RemoteClientSpec = {
        type: "fetch",
        uri,
    };
    const cookie = encodeURIComponent(JSON.stringify(spec));
    return (request, response, next) => {
        response.setHeader("Set-Cookie", `polypoly-bootstrap=${cookie}`);
        next();
    };
}

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

    // FIXME enable csp

    app.use("/rpc", await new RemoteServerPod(pod).listenOnMiddleware());
    app.use(cookieMiddleware(`/rpc`));
    app.use("/pod.js", async (request: IncomingMessage, response: ServerResponse) => {
        response.setHeader("Content-Type", "application/json");
        response.end(bootstrap);
    });
    app.use(serveStatic(join(rootDir, manifest.root)) as NextHandleFunction);

    const server = app.listen(port);
    await once(server, "listening");
    return server;
}
