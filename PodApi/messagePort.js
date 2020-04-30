window.addEventListener("message", receiveMessage, false);

function receiveMessage({ data }) {
    if (data.command == "httpRequest") {
        webkit.messageHandlers.httpRequest.postMessage(data);
    } else if (data.command == "log") {
        webkit.messageHandlers.log.postMessage(data);
    } else if (data.command == "getValue") {
        webkit.messageHandlers.getValue.postMessage(data);
    } else if (data.command == "setValue") {
        webkit.messageHandlers.setValue.postMessage(data);
    } else if (data.command == "addQuads") {
        webkit.messageHandlers.addQuads.postMessage(data);
    } else if (data.command == "selectQuads") {
        webkit.messageHandlers.selectQuads.postMessage(data);
    }
}

function respond(message) {
    document.querySelector("iframe").contentWindow.postMessage(message, "*");
}
