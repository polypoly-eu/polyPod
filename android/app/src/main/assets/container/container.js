// outerPort - bootstrap's end of a channel with the Pod
// port1 - bootstrap's end of a channel with the Feature
// port2 - Feature's end of a channel with the bootstrap
//
// Pod <-> innerPort <-> outerPort <-> boostrap <-> port1 <-> port2 <-> Feature
const { port1, port2 } = new MessageChannel();
let outerPort;

/*
For reasons we don't fully understand yet, we've seen the situation where the
feature is sending messages before the pod is actually fully initialised. As
a workaround, we queue messages received before initialisation.
*/
const queuedMessages = [];

function initMessaging() {
    window.onmessage = (event) => {
        // Action notifications have no port
        if (event.ports.length == 0) {
            let iFrame = document.getElementsByTagName("iframe")[0];
            iFrame.contentWindow.pod.polyNav.actions[event.data]();
            return;
        }
        outerPort = event.ports[0];
        outerPort.onmessage = (event) => {
            // console.log(`Data coming from Pod to the Feature`);
            // console.dir(event.data);
            const bytes = Uint8Array.from(atob(event.data), (c) =>
                c.charCodeAt(0)
            );
            port1.postMessage(bytes);
        };
        if (queuedMessages.length) {
            console.warn("Warning: replaying queued messages");
            while (queuedMessages.length) {
                const message = queuedMessages.shift();
                outerPort.postMessage(message);
            }
        }
    };
}

function initIframe(iFrame) {
    console.log("initializing iframe");

    iFrame.contentWindow.addEventListener("error", ({ error }) => {
        window.podInternal.reportError(
            `${error.stack}\nCause: ${error.cause.stack}`
        );
    });

    port1.start();
    port1.onmessage = (event) => {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(event.data)));
        if (!outerPort) {
            console.warn(
                "Warning: pod received a message before being " +
                    "fully initialised, queuing message"
            );
            queuedMessages.push(base64);
            return;
        }
        outerPort.postMessage(base64);
    };
    iFrame.contentWindow.postMessage("", "*", [port2]);
}

function loadFeature() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const featureName = urlParams.get("featureName");
    console.log(`Loading Feature: "${featureName}"`);
    const iFrame = document.getElementById("harness");
    iFrame.onload = (ev) => initIframe(ev.target);
    iFrame.src = `features/${featureName}/index.html`;
}

initMessaging();
loadFeature();
