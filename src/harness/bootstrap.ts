import {FeatureConstructor} from "@polypoly-eu/poly-api";
import {RemoteClientPod} from "@polypoly-eu/podigree";

declare const Feature: FeatureConstructor;

const feature = new Feature();

(async () => {
    const pod = RemoteClientPod.fromFetch("/rpc", window.fetch);
    await feature.init(pod);
    await window.fetch("/bootstrapped", {
        method: "post"
    });
})();