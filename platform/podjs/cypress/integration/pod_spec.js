import { podSpec } from "@polypoly-eu/pod-api";
import "../../dist/pod.js";

describe("pod.js satisfies spec", () => {
    console.log(window.pod);
    podSpec(window.pod);
});
