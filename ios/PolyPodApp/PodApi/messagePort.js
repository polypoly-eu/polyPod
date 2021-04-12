window.addEventListener("message", receiveMessage, false);

function receiveMessage({ data }) {
    if (["log", "podNav"].includes(data.command)) {
        webkit.messageHandlers[data.command].postMessage(data);
    }
}

function respond(message) {
    document.querySelector("iframe").contentWindow.postMessage(message, "*");
}
