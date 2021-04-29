let namespace = "";

const {port1, port2} = new MessageChannel();

function initMessaging() {
    window.onmessage = (event) => {
        // Set up pod connection
        event.ports[0].onmessage = (event) => {
            console.log(`Data coming from Pod to the Feature`);
            console.dir(event.data);
            const bytes = Uint8Array.from(atob(event.data), (c) =>
                c.charCodeAt(0)
            );
            port1.postMessage(bytes);
        };
    };
}

function initIframe(iFrame) {
    console.log("initializing iframe")
    port1.start();
    // Set up feature connection
    port1.onmessage = event => onFeatureMessage(event.data)
    iFrame.contentWindow.postMessage({
        type: "podLoad"
     } , "*", [port2]);
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
        `${ns}${featureName}`,
        `${ns}${input.key}`,
        `${ns}${input.value}`
    );
}

async function quadFromKey(input) {
    const { dataFactory } = pod;

    let ns = getNamespace(input.namespace);
    return dataFactory.quad(
        `${ns}${featureName}`,
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
        response = entries.some(
            ({ subject, predicate }) =>
                subject.value === `${namespace}${featureName}` &&
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
    port1.postMessage(response ? response : "");
}

initMessaging();
