#!/usr/bin/env node
import { startServer } from "../src/dummy-server.js";

// TODO: make this a parameter
let port = process.env.PORT;
if (!port) {
    port = 5005;
}

startServer(port);
