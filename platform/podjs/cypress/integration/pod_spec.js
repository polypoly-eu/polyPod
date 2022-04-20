import { podSpec } from "@polypoly-eu/pod-api";
import "../../dist/pod.js";

describe("pod.js satisfies spec", () => {
    podSpec(window.pod, "");
});
