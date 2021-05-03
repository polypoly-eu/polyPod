const podPort = Promise.race([
    new Promise((resolve) => {
        window.addEventListener("message", (event) => {
            if (event.data == "") {
                console.log("Pod initialized");
                resolve(event.ports[0]);
            }
        });
    }),
    // A promise that rejects in 1000 milliseconds
    new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject("Error: polyPod not initialized in time.");
        }, 1000);
    }),
]);

async function sendMessage(message) {
    return podPort.then((pod) => {
        message.type = "manual";
        return new Promise((resolve, reject) => {
            pod.onmessage = (event) => {
                if (event.error) {
                    reject(event.error);
                }
                if (typeof event.data != "string") {
                    // Ignore internal native messaging
                    return;
                }
                console.log(`Read value: ${event.data}`);
                resolve(event.data);
            };
            pod.postMessage(message);
        });
    });
}

async function postMessage(message) {
    return podPort.then((pod) => {
        message.data = message;
        message.data.type = "manual";
        pod.postMessage(message);
    });
}

async function readValue(key, namespace = null) {
    const entries = await sendMessage({
        polyIn: { select: { key, namespace } },
    });
    return entries;
}

function writeValue(key, value, namespace = null) {
    postMessage({
        polyIn: {
            add: { key, value, namespace },
        },
    });
}

function updatePodTitle(title) {
    postMessage({
        polyNav: {
            setTitle: title,
        },
    });
}

function onPodAction(action, callback) {
    postMessage({
        polyNav: {
            actions: action,
        },
    });
}

function updatePodActiveActions(activeActions) {
    postMessage({
        polyNav: {
            setActiveActions: activeActions,
        },
    });
}

export {
    readValue,
    writeValue,
    updatePodTitle,
    onPodAction,
    updatePodActiveActions,
};
