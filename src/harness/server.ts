import express from "express";
import {Server} from "http";
import {router} from "../pod/express";
import {htmlSkeleton} from "./html";
import {once} from "events";
import {Pod} from "@polypoly-eu/poly-api";
import {Feature} from "../feature/feature";

export async function serve(port: number, pod: Pod, feature: Feature, bootstrapCallback?: () => void): Promise<Server> {
    const app = express();

    const html = htmlSkeleton;

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
        res.send(await feature.css());
    });

    app.get("/bootstrap.js", async (req, res) => {
        res.contentType("text/javascript");
        res.send(await feature.bootstrap());
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