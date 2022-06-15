window.addEventListener("message", receiveMessage, false);

function receiveMessage({ data, origin }) {
    if (window.location.href.indexOf(origin) === 0) {
        return;
    }
    if (data.command === "log") {
        webkit.messageHandlers[data.command].postMessage(data);
    }
}

function respond(message) {
    document.querySelector("iframe").contentWindow.postMessage(message, "*");
}
