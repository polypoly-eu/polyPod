function postLogMessage(message) {
    window.parent.postMessage(
        { command: "log", text: JSON.stringify(message) },
        "*"
    );
}

const console = {
    log(msg) {
        postLogMessage(msg);
    },
    error(msg) {
        postLogMessage(msg);
    },
};
