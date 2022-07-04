import { podSpec } from "../spec";
import { DefaultPod } from "../default";
import { dataset } from "@rdfjs/dataset";
import { Volume } from "memfs";
import { FS } from "../fs";

describe("Mock pod", () => {
    podSpec(new DefaultPod(dataset(), new Volume().promises as unknown as FS), "/");
});
