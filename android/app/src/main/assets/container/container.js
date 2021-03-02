// outerPort - bootstrap's end of a channel with the Pod
// port1 - bootstrap's end of a channel with the Feature
// port2 - Feature's end of a channel with the bootstrap
//
// Pod <-> innerPort <-> outerPort <-> boostrap <-> port1 <-> port2 <-> Feature
const {port1, port2} = new MessageChannel();
let outerPort;

// To keep the burden of supporting older system WebView versions low on feature
// developers, we polyfill some modern JavaScript features.
// The more permanent solution is to not rely on the system WebView anymore.
function initPolyfills() {
    if (!Object.fromEntries) {
        Object.fromEntries = function(entries) {
            const obj = {};
            entries.forEach(([key, value]) => obj[key] = value);
            return obj;
        };
    }
}

function initMessaging() {
    window.onmessage = event => {
        outerPort = event.ports[0];
        outerPort.onmessage = event => {
            // console.log(`Data coming from Pod to the Feature`);
            // console.dir(event.data);
            const bytes = Uint8Array.from(atob(event.data), c => c.charCodeAt(0));
            port1.postMessage(bytes);
        }
    }
}

function initIframe(iFrame) {
    console.log("initializing iframe")
    port1.start();
    port1.onmessage = event => {
        // console.log(`Data coming from the Feature to the Pod`);
        const base64 = btoa(String.fromCharCode(...new Uint8Array(event.data)));
        console.dir(base64);
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
    iFrame.onload = ev => initIframe(ev.target);
    iFrame.src = `features/${featureName}/index.html`;
}

initPolyfills();
initMessaging();
loadFeature();
