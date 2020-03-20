import express from "express";
import {promises as fs} from "fs";
import {Server} from "http";
import {router} from "../pod/express";
import {htmlSkeleton} from "./html";
import {join} from "path";
import {rootDir} from "../_dir";
import {once} from "events";
import {Pod} from "@polypoly-eu/poly-api";
import {Feature} from "../feature/feature";

export async function serve(port: number, pod: Pod, feature: Feature): Promise<Server> {
    const app = express();

    const html = htmlSkeleton;

    const bootstrap = await fs.readFile(join(rootDir, "dist/bootstrap/index.js.txt"), { encoding: "utf-8" });

    app.get("/", (req, res) => {
        res.contentType("text/html");
        res.send(html);
    });

    app.get("/feature.js", async (req, res) => {
        res.contentType("text/javascript");
        res.send(await feature.js());
    });

    app.get("/feature.css", async (req, res) => {
        res.contentType("text/css");
        res.send((await feature.css()).join("\n"));
    });

    app.get("/bootstrap.js", (req, res) => {
        res.contentType("text/javascript");
        res.send(bootstrap);
    });

    app.use("/rpc", router(pod));

    const server = app.listen(port);
    await once(server, "listening");
    return server;
}