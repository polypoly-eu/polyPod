// outerPort - bootstrap's end of a channel with the Pod
// port1 - bootstrap's end of a channel with the Feature
// port2 - Feature's end of a channel with the bootstrap
//
// Pod <-> innerPort <-> outerPort <-> boostrap <-> port1 <-> port2 <-> Feature
const {port1, port2} = new MessageChannel();
let outerPort;
let featureName;
let namespace;

let namespace_start = "http://polypoly.coop/schema/";

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

function quadFromKeyValue(input) {
    const { dataFactory } = pod;
    return dataFactory.quad(
        `${namespace}${featureName}`,
        `${namespace}${input.key}`,
        `${namespace}${input.value}`
    );
}

function quadFromKey(input) {
    const { dataFactory } = pod;
    return dataFactory.quad(
        `${namespace}${featureName}`,
        `${namespace}${input.key}`
    );
}

function arrayFromQuads(quads) {
    return quads.map((quad) => quad.value.substring(namespace.length()) )
}

function onFeatureMessage(message) {

    let response = null;

    if (message.polyIn) {
        if (message.polyIn.add) {
            const { polyIn } = pod;
            response = await polyIn.add(quadFromKeyValue(message.polyIn.add));
        }
        if (message.polyIn.select) {
            let entries = await pod.polyIn.select(
                quadFromKey(message.polyIn.select)
            );
            response = entries.some(
                ({ subject, predicate }) =>
                    subject.value === `${namespace}${featureName}` &&
                    predicate.value === `${namespace}${key}`
            );
            response = arrayFromQuads(response);
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
    iFrame.contentWindow.postMessage({
        type: "podLoad",
        featureName: featureName
     } , "*", [port2]);
}

function loadFeature() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    featureName = urlParams.get("featureName");
    namespace = `${namespace_start}${featureName}`
    console.log(`Loading Feature: "${featureName}"`);
    // TODO: Do we want to support "background" features?
    const iFrame = document.getElementById("harness");
    iFrame.onload = ev => initIframe(ev.target);
    iFrame.src = `features/${featureName}/index.html`;
}

initMessaging();
loadFeature();
