window.addEventListener("message", receiveMessage, false);

function receiveMessage({ data }) {
    if (data.command == "log") {
        webkit.messageHandlers.log.postMessage(data);
    }
}

function respond(message) {
    document.querySelector("iframe").contentWindow.postMessage(message, "*");
}
