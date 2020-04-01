import express, {Response} from "express";
import {Server} from "http";
import {router} from "../pod/express";
import {htmlSkeleton} from "./html";
import {once} from "events";
import {Pod} from "@polypoly-eu/poly-api";
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
    reactPath: join(rootDir, browserScriptsPath, "react.js.txt"),
    reactDomPath: join(rootDir, browserScriptsPath, "react-dom.js.txt")
};

async function sendFile(path: string, res: Response): Promise<void> {
    const contents = await fs.readFile(path, { encoding: "utf-8" });
    res.send(contents);
}

export async function serve(
    port: number,
    pod: Pod,
    manifest: Manifest,
    config: Config,
    bootstrapCallback?: () => void
): Promise<Server> {
    const app = express();

    const html = htmlSkeleton;

    app.get("/", (req, res) => {
        res.contentType("text/html");
        res.send(html);
    });

    // TODO use express.static?

    app.get("/feature.js", async (req, res) => {
        res.contentType("text/javascript");
        sendFile(manifest.jsPath, res);
    });

    app.get("/feature.css", async (req, res) => {
        res.contentType("text/css");
        sendFile(manifest.cssPath, res);
    });

    app.get("/react.js", async (req, res) => {
        res.contentType("text/javascript");
        sendFile(config.reactPath, res);
    });

    app.get("/react-dom.js", async (req, res) => {
        res.contentType("text/javascript");
        sendFile(config.reactDomPath, res);
    });

    app.get("/bootstrap.js", async (req, res) => {
        res.contentType("text/javascript");
        sendFile(config.bootstrapPath, res);
    });

    app.use("/rpc", router(pod));

    app.post("/bootstrapped", (req, res) => {
        res.status(204);
        res.send();
        if (bootstrapCallback)
            bootstrapCallback();
    });

    const server = app.listen(port);
    await once(server, "listening");
    return server;
}