import { DefaultPod } from "./default";
import { dataset } from "@rdfjs/dataset";
import { Volume } from "memfs";
import { FS } from "./fs";

export class MockPod extends DefaultPod {
    constructor() {
        super(dataset(), new Volume().promises as unknown as FS);
    }
}
