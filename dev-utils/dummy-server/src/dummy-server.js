import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const server = createServer(app);

const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: "*/*" }));
app.use(express.json({ type: "*/*" }));

app.get("/", (req, res) => res.send("Received a GET HTTP method"));
app.get("/robots.txt", (req, res) =>
    res.send("User-agent: *\nDisallow: /deny\n")
);
app.get("/json", (req, res) => res.json({ slideshow: {} }));
app.get("/redirect-to", (req, res) => {
    res.redirect(req.query.url);
});
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

function startServer(port) {
    io.on("connection", (socketServer) => {
        socketServer.on("npmStop", () => {
            console.log("Dummy server stopped");
            process.exit(0);
        });
    });
    server.listen(port, () =>
        console.log(`Dummy server is listening on port ${port}!`)
    );
}

export { app, startServer };
