import { DefaultPod, DefaultPolyOut } from "./default";
import { dataset } from "@rdfjs/dataset";
import { Volume } from "memfs";
import { FS } from "./fs";

export class MockPolyOut extends DefaultPolyOut {
    constructor(fs?: FS) {
        super(fs || (new Volume().promises as unknown as FS));
    }
}

export class MockPod extends DefaultPod {
    constructor(fs?: FS) {
        const aFs = fs || (new Volume().promises as unknown as FS);
        super(dataset(), aFs, new MockPolyOut(aFs));
    }
}
