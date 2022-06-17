import { podSpec } from "../spec";
import { MockPod } from "../mock-pod";

describe("Mock pod", () => {
   podSpec(new MockPod(), "/");
});
