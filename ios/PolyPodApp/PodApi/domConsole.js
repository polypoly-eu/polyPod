const console = {
    log(msg) {
        window.parent.postMessage({ command: "log", text: JSON.stringify(msg) }, "*");
    },
    error(msg) {
        window.parent.postMessage({ command: "log", text: JSON.stringify(msg) }, "*");
    },
    dir(object) {
        window.parent.postMessage({ command: "log", text: JSON.stringify(object) }, "*");
    }
};
