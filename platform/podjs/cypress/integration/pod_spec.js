import { podSpec } from "@polypoly-eu/api/dist/spec";
import "../../dist/pod.js";

describe("pod.js satisfies spec", () => {
    podSpec(window.pod, "");
});
