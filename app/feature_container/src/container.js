const {port1, port2} = new MessageChannel();

let outerPort;

// outerPort - bootstrap's end of a channel with the Pod
// port1 - bootstrap's end of a channel with the Feature
// port2 - Feature's end of a channel with the bootstrap

// Pod <-> innerPort <-> outerPort <-> boostrap <-> port1 <-> port2 <-> Feature

window.onmessage = event => {
    outerPort = event.ports[0];
    outerPort.onmessage = event => {
        // console.log(`Data coming from Pod to the Feature`);
        // console.dir(event.data);
        const bytes = event.data.split(",");
        const buf = Uint8Array.of(...bytes.map(byte => parseInt(byte)));
        port1.postMessage(buf);
    }
}

function initIframe(iFrame) {
    console.log("initializing iframe")
    port1.start();
    port1.onmessage = event => {
        // console.log(`Data coming from the Feature to the Pod`);
        // console.dir(event.data);
        outerPort.postMessage(event.data.toString());
    };
    iFrame.contentWindow.postMessage("", "*", [port2]);
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

loadFeature();
