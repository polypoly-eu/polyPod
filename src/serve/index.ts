import {Server} from "http";
import {once} from "events";
import {Pod} from "@polypoly-eu/poly-api";
import {RemoteServerPod} from "@polypoly-eu/podigree";
import {join} from "path";
import {Manifest} from "@polypoly-eu/customs";
import {RemoteClientSpec} from "@polypoly-eu/feature-bootstrap";
import createServer, {NextHandleFunction} from "connect";
import serveStatic from "serve-static";

export function cookieMiddleware(uri: string): NextHandleFunction {
    const spec: RemoteClientSpec = {
        type: "fetch",
        uri
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

    // FIXME enable csp

    app.use("/rpc", await new RemoteServerPod(pod).listenOnMiddleware());
    app.use(cookieMiddleware(`/rpc`));
    app.use(serveStatic(join(rootDir, manifest.root)) as NextHandleFunction);

    const server = app.listen(port);
    await once(server, "listening");
    return server;
}