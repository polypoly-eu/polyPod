import {FeatureConstructor} from "@polypoly-eu/poly-api";
import {RemoteClientPod} from "@polypoly-eu/podigree";

declare const Feature: FeatureConstructor;

const feature = new Feature();

// implementation note:
// the Pod API specifies that control flow is yielded to the Feature when calling `feature.init`
// here we trigger a completion event for testing purposes only: in tests, we need to await the completion of a feature
// run to not shut down the RPC server early

(async () => {
    const pod = RemoteClientPod.fromFetch("/rpc", window.fetch);
    await feature.init(pod);
    window.dispatchEvent(new CustomEvent("completed"));
})();