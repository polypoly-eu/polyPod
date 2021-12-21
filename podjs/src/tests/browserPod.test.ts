import { podSpec } from "@polypoly-eu/pod-api";
import { BrowserPod } from "../browserPod";

describe("BrowserPod satisfies spec", () => {
    podSpec(new BrowserPod());
});
