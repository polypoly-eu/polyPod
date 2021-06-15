#!/usr/bin/env node
import { startServer } from "./dummy-server.js";

const configurationArgs = ["-c", "--config"];
const leng = process.argv.length;

let index = 2;

while (index < leng && configurationArgs.includes(process.argv[index])) {
    index++;
}
// TODO: make this a parameter
let port = process.env.PORT;
if (!port) {
    port = 5005;
}

if (index < leng) {
    startServer(port, process.argv[index]);
} else {
    startServer(port);
}
