const console = {
    log(text) {
        postOffice.postMessage({ command: "log", text: JSON.stringify(text) });
    },
    error(text) {
        postOffice.postMessage({ command: "log", text: text });
    },
    dir(data) {
        postOffice.postMessage({ command: "log", text: JSON.stringify(data) });
    }
};
