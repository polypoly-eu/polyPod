import { DefaultPod } from "./default";
import { dataset } from "@rdfjs/dataset";
import { Volume } from "memfs";
import { FS } from "./fs";

export class MockPod extends DefaultPod {
    constructor(fs?: FS) {
        super(dataset(), fs || (new Volume().promises as unknown as FS));
    }
}
