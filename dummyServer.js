const express = require("express");
let bodyParser = require("body-parser");

const app = express();

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
