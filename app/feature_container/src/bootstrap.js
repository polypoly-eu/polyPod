const {port1, port2} = new MessageChannel();

let outerPort;

window.onmessage = event => {
    outerPort = event.ports[0];
    outerPort.onmessage = event => {
        const bytes = event.data.split(",");
        const buf = Uint8Array.of(...bytes.map(byte => parseInt(byte)));
        port1.postMessage(buf);
    }
}

function initIframe(iFrame) {
    console.log("initializing iframe")
    port1.start();
    port1.onmessage = event => {
        console.dir(event.data);
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
