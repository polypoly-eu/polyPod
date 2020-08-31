import { RemoteClientPod, RemoteServerPod } from "@polypoly-eu/podigree";
import { iframeOuterPort } from "@polypoly-eu/port-authority";

const pod = RemoteClientPod.fromFetch("/rpc");
const container = document.querySelector("#container")!;
const iframe = document.createElement("iframe");

iframe.setAttribute("sandbox", "allow-scripts");
iframe.setAttribute("src", `/feature/index.html`);
iframe.onload = () => {
    new RemoteServerPod(pod).listenOnRaw(iframeOuterPort("", iframe));
};

container.appendChild(iframe);
