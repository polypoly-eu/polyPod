#!/usr/bin/env node

// TODO: make this a parameter
let port = process.env.PORT;
if (!port) {
    port = 5005;
}

require("./dummy-server").startServer(port);  