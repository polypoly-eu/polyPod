const {port1, port2} = new MessageChannel();
let outerPort;
const namespace = "";

function initMessaging() {
    window.onmessage = event => {
        outerPort = event.ports[0];
        outerPort.onmessage = event => {
            console.log(`Data coming from Pod to the Feature`);
            console.dir(event.data);
            const bytes = Uint8Array.from(atob(event.data), c => c.charCodeAt(0));
            port1.postMessage(bytes);
        }
    }
}

function initIframe(iFrame) {
    console.log("initializing iframe")
    port1.start();
    port1.onmessage = event => {
        if (event.data.type == "manual") {
            console.log(`Manual data from the Feature to the container: ${JSON.stringify(event.data)}`);
            onFeatureMessage(event.data);
            return;
        }
        console.log(`Raw data coming from the container to the Pod: ${event.type}`);
        const base64 = btoa(String.fromCharCode(...new Uint8Array(event.data)));
        console.dir(base64);
        outerPort.postMessage(base64);
    };
    iFrame.contentWindow.postMessage("", "*", [port2]);
}


async function getNamespace(requestedNamespace, rights) {
    let ns = namespace;
    if (requestedNamespace) {
        ns = requestedNamespace;
    }
    return ns;
}

async function quadFromKeyValue(input) {
    const { dataFactory } = pod;
    let ns = getNamespace(input.namespace);
    return dataFactory.quad(
        `${ns}${window.featureName}`,
        `${ns}${input.key}`,
        `${ns}${input.value}`
    );
}

async function quadFromKey(input) {
    const { dataFactory } = pod;

    let ns = getNamespace(input.namespace);
    return dataFactory.quad(
        `${ns}${window.featureName}`,
        `${ns}${input.key}`
    );
}

function arrayFromQuads(quads) {
    return quads.map((quad) => quad.value.substring(namespace.length()) )
}

async function onFeatureMessage(message) {
    let response = null;

    if (message.polyIn?.add) {
        const { polyIn } = pod;
        response = await polyIn.add(quadFromKeyValue(message.polyIn.add));
    }
    if (message.polyIn?.select) {
        const entries = await pod.polyIn.select(
            quadFromKey(message.polyIn.select)
        );
        response = entries?.some(
            ({ subject, predicate }) =>
                subject.value === `${namespace}${window.featureName}` &&
                predicate.value === `${namespace}${key}`
        );
        response = arrayFromQuads(response);
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
    if (response){
        port2.postMessage(response);
    }
}

initMessaging();
