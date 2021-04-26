import { Exception } from "handlebars";

let pod = null;
let featureName = "";

window.addEventListener("message", (event) => {
    if (event.data?.type == "podLoad") {
        pod = event.ports[0];
        featureName = event.data.featureName;
    }
});

function checkInit() {
    if (featureName) return;
    throw new Exception("Feature not initialized!");
}

async function sendMessage(message) {
    return new Promise((resolve, reject) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = ({ data }) => {
            channel.port1.close();
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.result);
            }
        };

        pod.postMessage(message, [channel.port2]);
    });
}

async function readValue(key) {
    checkInit();

    // TODO: Should features be allowed to read/write from other features?
    const entries = await sendMessage({
        polyIn: { select: { key } },
    });

    return !entries.some(({ value }) => value === `false`);
}

async function writeValue(key, value) {
    checkInit();
    await sendMessage({
        polyIn: {
            add: { key, value },
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

function updatePodActions(actions) {
    sendMessage({
        polyNav: {
            actions: actions,
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
    updatePodActions,
    updatePodActiveActions,
};
