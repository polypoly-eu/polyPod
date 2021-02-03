const express = require("express");

const app = express();

var bodyParser = require("body-parser");

app.use(bodyParser.text({ type: "*/*" }));

// GET
app.get("/", (req, res) => {
    return res.send("Received a GET HTTP method");
});

app.get("/robots.txt", (req, res) => {
    return res.send("User-agent: *\nDisallow: /deny\n");
});

app.get("/json", (req, res) => {
    return res.send(`{"slideshow": {}}`);
});

app.get("/redirect-to", (req, res) => {
    return res.redirect(req.query.url);
});

app.get("/status/201", (req, res) => {
    res.statusMessage = "CREATED";
    return res.status(201).send();
});

// POST
app.post("/", (req, res) => {
    return res.send(req.body);
});

app.post("/anything", (req, res) => {
    return res.json({ method: "POST", data: req.body});
});

app.put("/", (req, res) => {
    return res.send("Received a PUT HTTP method");
});

app.delete("/", (req, res) => {
    return res.send("Received a DELETE HTTP method");
});

let serverSingleton = null;

async function startServer() {
    serverSingleton = app.listen(process.env.PORT, () =>
        console.log(`Example app listening on port ${process.env.PORT}!`)
    );
}

async function stopServer() {
    serverSingleton.close();
}
module.exports = {
    startServer, stopServer
} 
