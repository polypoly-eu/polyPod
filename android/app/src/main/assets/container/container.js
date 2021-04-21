// outerPort - bootstrap's end of a channel with the Pod
// port1 - bootstrap's end of a channel with the Feature
// port2 - Feature's end of a channel with the bootstrap
//
// Pod <-> innerPort <-> outerPort <-> boostrap <-> port1 <-> port2 <-> Feature
const {port1, port2} = new MessageChannel();
let outerPort;

function initMessaging() {
    window.onmessage = event => {
        outerPort = event.ports[0];
        // Set up pod connection
        outerPort.onmessage = event => {
            // console.log(`Data coming from Pod to the Feature`);
            // console.dir(event.data);
            const bytes = Uint8Array.from(atob(event.data), c => c.charCodeAt(0));
            port1.postMessage(bytes);
        }
    }
}

function onFeatureMessage(message) {

    let response = null;

    if (message.polyIn) {
        if (message.polyIn.add) {
            const { dataFactory, polyIn } = pod;
            const quad = dataFactory.quad(
                message.polyIn.add[0],
                message.polyIn.add[1],
                message.polyIn.add[2]
            );
            response = await polyIn.add(quad);
        }
        if (message.polyIn.select) {
            response = await pod.polyIn.select();
        }
    }

    if (message.polyNav) {
        if (message.polyNav.setTitle) {
            podNav.setTitle(message.polyNav.setTitle);
        }
        if (message.polyNav.actions) {
            podNav.actions = message.polyNav.actions;
        }
        if (message.polyNav.setActiveActions) {
            podNav.setActiveActions = message.polyNav.setActiveActions;
        }
    }

    // Send the response back
    message.ports[0].postMessage(response);
}

function initIframe(iFrame) {
    console.log("initializing iframe")
    port1.start();
    // Set up feature connection
    port1.onmessage = event => onFeatureMessage(event.data)


    port1.onmessage = event => {
        // console.log(`Data coming from the Feature to the Pod`);
        const base64 = btoa(String.fromCharCode(...new Uint8Array(event.data)));
        console.dir(base64);
        outerPort.postMessage(base64);
    };
    iFrame.contentWindow.postMessage("podLoad", "*", [port2]);
}

function loadFeature() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const featureName = urlParams.get("featureName");
    console.log(`Loading Feature: "${featureName}"`);
    const iFrame = document.getElementById("harness");
    iFrame.onload = ev => initIframe(ev.target);
    iFrame.src = `features/${featureName}/index.html`;
}

initMessaging();
loadFeature();
