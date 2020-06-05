import express, {Response, Router} from "express";
import {Server} from "http";
import {htmlSkeleton} from "./html";
import {once} from "events";
import {Pod} from "@polypoly-eu/poly-api";
import {RemoteServerPod} from "@polypoly-eu/podigree";
import {Manifest} from "../feature/manifest";
import {join} from "path";
import {rootDir} from "../_dir";
import {promises as fs} from "fs";
// @ts-ignore
import {browserScriptsPath} from "../../build/paths";

export interface Config {
    bootstrapPath: string;
    reactPath: string;
    reactDomPath: string;
}

export const defaultConfig: Config = {
    bootstrapPath: join(rootDir, browserScriptsPath, "bootstrap.js.txt"),
    reactPath: join(rootDir, "node_modules/react/umd/react.development.js"),
    reactDomPath: join(rootDir, "node_modules/react-dom/umd/react-dom.development.js")
};

async function sendFile(path: string, res: Response): Promise<void> {
    const contents = await fs.readFile(path, { encoding: "utf-8" });
    res.send(contents);
}

export async function serve(
    port: number,
    pod: Pod,
    manifest: Manifest,
    config: Config
): Promise<Server> {
    const app = express();

    const html = htmlSkeleton;

    app.get("/", (req, res) => {
        res.contentType("text/html");
        res.send(html);
    });

    // TODO use express.static?

    app.get("/feature.js", (req, res) => {
        res.contentType("text/javascript");
        sendFile(manifest.jsPath, res);
    });

    app.get("/feature.css", (req, res) => {
        res.contentType("text/css");
        sendFile(manifest.cssPath, res);
    });

    app.get("/react.js", (req, res) => {
        res.contentType("text/javascript");
        sendFile(config.reactPath, res);
    });

    app.get("/react-dom.js", (req, res) => {
        res.contentType("text/javascript");
        sendFile(config.reactDomPath, res);
    });

    app.get("/bootstrap.js", (req, res) => {
        res.contentType("text/javascript");
        sendFile(config.bootstrapPath, res);
    });

    const rpcRouter = Router();
    const remotePod = new RemoteServerPod(pod);
    remotePod.listenOnRouter(rpcRouter);

    app.use("/rpc", rpcRouter);

    const server = app.listen(port);
    await once(server, "listening");
    return server;
}