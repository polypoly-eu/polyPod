import http from "http";

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

async function sendResponse(response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader("Content-Type", "text/plain");
    response.statusCode = 200;
    response.end("OK\n");
}

function logRequest(request, body) {
    if (!body) return;
    console.log("----- Received request -----");
    console.log("Timestamp: ", new Date());
    console.log("Authorization: ", request.headers?.authorization);
    console.log("[body start]");
    console.log(body);
    console.log("[body end]\n");
}

const server = http.createServer(async (request, response) => {
    const body = await readPostBody(request);
    await sendResponse(response);
    logRequest(request, body);
});

server.listen(8000);
