import { iframeInnerPort } from "../index";
import { DataFactory } from "@polypoly-eu/api";
import { RemoteClientPod } from "./remote";
import { AsyncPod } from "./async";

window.pod = new AsyncPod(
    iframeInnerPort("").then((pod) => RemoteClientPod.fromRawPort(pod)),
    new DataFactory(false)
);
