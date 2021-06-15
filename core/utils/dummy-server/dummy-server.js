import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import bodyParser from "body-parser";
import { promisify } from "util";
import fs from "fs";
import { join } from "path";
const { text } = bodyParser;

const app = express();
const server = createServer(app);

const io = new Server(server);

async function getConfiguration(config) {
    const checkFileExist = promisify(fs.exists);
    const readFile = promisify(fs.readFile);
    const completePath = join(process.cwd(), config);

    const fileExist = await checkFileExist(completePath);

    if (!fileExist) {
        throw new Error("Configuration file not found");
    }

    return readFile(completePath, { encoding: "utf-8" }).then((content) => {
        const obj = JSON.parse(content);
        return obj;
    });
}

async function setServerOnConfiguration(config, appServ) {
    const serverCustomConfig = await getConfiguration(config);
    const readFile = promisify(fs.readFile);
    const checkFileExist = promisify(fs.exists);
    const getStat = promisify(fs.lstat);

    const textFiles = ["html", "css", "js", "cjs", "ts", "svg"];

    appServ.get("/*", async (req, res) => {
        const allowendAccess = serverCustomConfig.filesServed.find((exp) =>
            RegExp(exp).test(req.path)
        );

        if (!allowendAccess) {
            res.status(403);
            res.send("Don't have access to the path");
            return;
        }

        let path = join(process.cwd(), serverCustomConfig.basePath, req.path);

        const fileExist = await checkFileExist(path);

        if (!fileExist) {
            res.status(404);
            res.send("File not found");
            return;
        }

        const isDirectory = await getStat(path).then((stats) =>
            stats.isDirectory()
        );

        if (isDirectory) {
            path = join(path, "index.html");
        }

        const fileType = path.split(".").pop();
        const content = textFiles.includes(fileType)
            ? await readFile(path, { encoding: "utf-8" })
            : await readFile(path);

        res.type(fileType);
        res.status(200);
        res.send(content);
    });
}

function defaultServerConfig(appServ) {
    appServ.get("/", (req, res) => res.send("Received a GET HTTP method"));
}

function launchServer(port) {
    server.listen(port, () =>
        console.log(`Dummy server is listening on port ${port}!`)
    );
}

app.use(text({ type: "*/*" }));

app.get("/robots.txt", (req, res) =>
    res.send("User-agent: *\nDisallow: /deny\n")
);
app.get("/json", (req, res) => res.send(`{"slideshow": {}}`));
app.get("/redirect-to", (req, res) => res.redirect(req.query.url));
app.get("/status/201", (req, res) => {
    res.statusMessage = "CREATED";
    return res.status(201).send();
});

app.post("/", (req, res) => res.send(req.body));
app.post("/anything", (req, res) =>
    res.json({ method: "POST", data: req.body })
);

app.put("/", (req, res) => res.send("Received a PUT HTTP method"));

app.delete("/", (req, res) => res.send("Received a DELETE HTTP method"));

function startServer(port, config) {
    io.on("connection", (socketServer) => {
        socketServer.on("npmStop", () => {
            console.log("Dummy server stopped");
            process.exit(0);
        });
    });

    if (config) {
        setServerOnConfiguration(config, app).then(() => {
            launchServer(port);
        });
    } else {
        defaultServerConfig(app);
        launchServer(port);
    }
}

export { startServer };
