import { DefaultPod, DefaultPolyOut } from "./default";
import { dataset } from "@rdfjs/dataset";
import { Volume } from "memfs";
import { FS } from "./fs";
import { isPolypodUri, PolyUri, PolyPodUriError } from "./uri";

export class MockPolyOut extends DefaultPolyOut {
    constructor(fs?: FS) {
        super(fs || (new Volume().promises as unknown as FS));
    }

    async importArchive(path: string, destUri?: string): Promise<string> {
        if (!destUri) {
            destUri = new PolyUri().toString();
        } else {
            if (!isPolypodUri(destUri)) {
                throw new PolyPodUriError(`${destUri} is not a polyPod URI`);
            }
        }
        return destUri;
    }
}

export class MockPod extends DefaultPod {
    constructor(fs?: FS) {
        const aFs = fs || (new Volume().promises as unknown as FS);
        super(dataset(), aFs, new MockPolyOut(aFs));
    }
}
