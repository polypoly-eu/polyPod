import {fromFetch} from "@polypoly-eu/postoffice";
import {FeatureConstructor} from "@polypoly-eu/poly-api";
import {dataFactory} from "@polypoly-eu/rdf";
import {remotePod} from "../pods/remote-pod";

declare const Feature: FeatureConstructor;

const feature = new Feature();

(async () => {
    const pod = remotePod(fromFetch("/rpc", window.fetch), dataFactory);
    await feature.init(pod);
    await window.fetch("/bootstrapped", {
        method: "post"
    });
})();