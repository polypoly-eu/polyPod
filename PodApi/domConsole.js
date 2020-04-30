const console = {
    log(msg) {
        postOffice.postMessage({ command: "log", text: JSON.stringify(msg) });
    },
    error(msg) {
        postOffice.postMessage({ command: "log", text: JSON.stringify(msg) });
    },
    dir(object) {
        postOffice.postMessage({ command: "log", text: JSON.stringify(object) });
    }
};
