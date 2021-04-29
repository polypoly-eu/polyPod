let featureName = "";

let podPort = Promise.race([
    new Promise((resolve) => {
        window.addEventListener("message", (event) => {
            if (event.data?.type == "podLoad") {
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
    return await new Promise((resolve) => {
        podPort.then((pod) => {
            pod.onmessage = (event) => resolve(event);
            pod.postMessage(message);
        });
    });
}

async function readValue(key, namespace = null) {
    const entries = sendMessage({
        polyIn: { select: { key, namespace } },
    });

    return !entries.some(({ value }) => value === `false`);
}

async function writeValue(key, value, namespace = null) {
    sendMessage({
        polyIn: {
            add: { key, value, namespace },
        },
    });
}

function updatePodTitle(title) {
    sendMessage({
        polyNav: {
            setTitle: title,
        },
    });
}

function onPodAction(action, callback) {
    sendMessage({
        polyNav: {
            actions: action,
        },
    });
}

function updatePodActiveActions(activeActions) {
    sendMessage({
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
