import { RDF } from "@polypoly-eu/api";
import { iframeInnerPort } from "../port-authority";
import { RemoteClientPod } from "./remote";
import { AsyncPod } from "./async";

window.pod = new AsyncPod(
    iframeInnerPort("").then((pod) => RemoteClientPod.fromRawPort(pod)),
    new RDF.DataFactory(false)
);
