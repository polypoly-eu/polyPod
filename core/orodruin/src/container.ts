import { RemoteClientPod, RemoteServerPod } from "@polypoly-eu/podigree";
import { BrowserPod } from "@polypoly-eu/podjs";
import { iframeOuterPort } from "@polypoly-eu/port-authority";
import type { Pod } from "@polypoly-eu/poly-api";

function createPod(): Pod {
    if (document.currentScript && document.currentScript.dataset.pod === "browser") {
        console.log("Using in-browser pod");
        return new BrowserPod();
    }

    console.log("Using RPC pod");
    return RemoteClientPod.fromFetch("/rpc");
}

const pod = createPod();

export function hideDashboard(): void {
    const body = document.body;
    body.querySelectorAll<HTMLElement>(".dashboard")[0].className = "hidden";
    const headers = body.querySelectorAll<HTMLElement>("h1");
    for (let i = 0; i < headers.length; i++) {
        headers[i].className = "hidden";
    }
    body.querySelectorAll<HTMLElement>("#container")[0].style.border = "none";
}

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
