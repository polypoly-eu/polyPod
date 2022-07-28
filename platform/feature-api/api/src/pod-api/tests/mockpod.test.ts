import { podSpec } from "../spec";
import { MockPod } from "../mock-pod";
import { FS } from "../fs";

import { Volume } from "memfs";

describe("Mock pod with default values", () => {
    podSpec(new MockPod(), "/");
});

describe("Mock pod with existing fs", () => {
    const fs = new Volume().promises as unknown as FS;
    podSpec(new MockPod(fs), "/");
});
