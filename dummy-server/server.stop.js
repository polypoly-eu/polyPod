#!/usr/bin/env node

import * as socketio from "socket.io-client";

// TODO: make this a parameter
let port = process.env.PORT;
if (!port) {
    port = 5005;
}

const socketClient = socketio.connect(`http://localhost:${port}`);

socketClient.on("connect", () => {
    socketClient.emit("npmStop");
    setTimeout(() => {
        process.exit(0);
    }, 500);
});
