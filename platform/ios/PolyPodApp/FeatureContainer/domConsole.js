function postLogMessage(message) {
    window.parent.postMessage(
        { command: "log", text: JSON.stringify(message) },
        "*"
    );
}

const console = {
    log: postLogMessage,
    warn: postLogMessage,
    debug: postLogMessage,
    error: postLogMessage,
    dir: postLogMessage,
};
