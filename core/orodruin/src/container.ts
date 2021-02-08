import { browserPod, RemoteClientPod, RemoteServerPod } from "@polypoly-eu/podigree";
import { iframeOuterPort } from "@polypoly-eu/port-authority";
import type { Pod } from "@polypoly-eu/poly-api";

function createPod(): Pod {
    if (document.currentScript && document.currentScript.dataset.pod === "browser") {
        console.log("Using in-browser pod");
        return browserPod();
    }

    console.log("Using RPC pod");
    return RemoteClientPod.fromFetch("/rpc");
}

const pod = createPod();

export function loadIframe(): void {
    const container = document.querySelector("#container")!;
    const iframe = document.createElement("iframe");
    iframe.onload = () => {
        new RemoteServerPod(pod).listenOnRaw(iframeOuterPort("", iframe));
    };
    // FIXME enable CSP
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("src", `/feature/index.html`);
    container.appendChild(iframe);
}

export function unloadIframe(): void {
    const container = document.querySelector("#container")!;
    const iframe = container.querySelector("iframe");
    if (!iframe) throw new Error("iframe not loaded");
    container.removeChild(iframe);
}

export function reloadIframe(): void {
    unloadIframe();
    loadIframe();
}
