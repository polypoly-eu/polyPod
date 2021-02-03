import {Request, Response } from "express";
import { Server } from "http";

const express = require("express");

const app = express();

var bodyParser = require("body-parser");

app.use(bodyParser.text({ type: "*/*" }));

// GET
app.get("/", (req: Request, res: Response) => {
    return res.send("Received a GET HTTP method");
});

app.get("/robots.txt", (req: Request, res: Response) => {
    return res.send("User-agent: *\nDisallow: /deny\n");
});

app.get("/json", (req: Request, res: Response) => {
    return res.send(`{"slideshow": {}}`);
});

app.get("/redirect-to", (req: Request, res: Response) => {
    return res.redirect(req.query.url as string);
});

app.get("/status/201", (req: Request, res: Response) => {
    res.statusMessage = "CREATED";
    return res.status(201).send();
});

// POST
app.post("/", (req: Request, res: Response) => {
    return res.send(req.body);
});

app.post("/anything", (req: Request, res: Response) => {
    return res.json({ method: "POST", data: req.body});
});

app.put("/", (req: Request, res: Response) => {
    return res.send("Received a PUT HTTP method");
});

app.delete("/", (req: Request, res: Response) => {
    return res.send("Received a DELETE HTTP method");
});

let serverSingleton: Server;

export async function startServer(): Promise<void> {
    serverSingleton = app.listen(process.env.PORT, () =>
        console.log(`Example app listening on port ${process.env.PORT}!`)
    );
}

export async function stopServer(): Promise<void> {
    serverSingleton.close();
}
