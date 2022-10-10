import { DefaultPod, DefaultPolyOut } from "./default";
import { dataset } from "@rdfjs/dataset";
import { Volume } from "memfs";
import { isPolypodUri, PolyUri, PolyPodUriError } from "./uri";
import * as zip from "@zip.js/zip.js";

export class MockPolyOut extends DefaultPolyOut {
    entries: { [uri: string]: zip.Entry[] };

    constructor(fs = new Volume().promises) {
        super(fs);
        this.entries = { "": [] };
    }

    async importArchive(
        path: string,
        destUri: string = new PolyUri().toString()
    ): Promise<string> {
        if (!isPolypodUri(destUri)) {
            throw new PolyPodUriError(`${destUri} is not a polyPod URI`);
        }

        const data = await this.fs.readFile(path, { encoding: "binary" });

        const zipReader = new zip.ZipReader(new zip.BlobReader(data));
        this.entries[destUri] = await zipReader.getEntries();
        return destUri;
    }
}

export class MockPod extends DefaultPod {
    constructor(fs = new Volume().promises) {
        super(dataset(), fs, new MockPolyOut(fs));
    }
}
