const http = require('http');
const socketio = require("socket.io");
let app = require("express")();
let bodyParser = require("body-parser");

let server = http.createServer(app);

io = socketio(server);

app.use(bodyParser.text({ type: "*/*" }));

app.get("/", (req, res) => res.send("Received a GET HTTP method"));
app.get("/robots.txt", (req, res) => res.send("User-agent: *\nDisallow: /deny\n"));
app.get("/json", (req, res) => res.send(`{"slideshow": {}}`));
app.get("/redirect-to", (req, res) => res.redirect(req.query.url));
app.get("/status/201", (req, res) => {
    res.statusMessage = "CREATED";
    return res.status(201).send();
});

app.post("/", (req, res) => res.send(req.body));
app.post("/anything", (req, res) => res.json({ method: "POST", data: req.body}));

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

module.exports = {
    startServer
} 
