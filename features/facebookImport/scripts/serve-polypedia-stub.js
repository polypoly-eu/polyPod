const http = require("http");

async function readPostBody(request) {
    if (request.method !== "POST") return null;
    return new Promise((resolve) => {
        let body = "";
        request.on("data", (data) => {
            body += data;
        });
        request.on("end", () => {
            resolve(body);
        });
    });
}

const server = http.createServer((req, res) => {
    readPostBody(req).then((body) => {
        if (body) console.log(body);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader("Content-Type", "text/plain");
        res.statusCode = 200;
        res.end("OK\n");
    });
});

server.listen(8000);
