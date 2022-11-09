import { podSpec } from "@polypoly-eu/api";
import "../../dist/pod.js";

describe("pod.js satisfies spec", () => {
    podSpec(window.pod, "");
});
