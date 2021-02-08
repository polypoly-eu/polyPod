import type { FS, Pod } from "@polypoly-eu/poly-api";
import { DefaultPod } from "@polypoly-eu/poly-api";
import { Volume } from "memfs";
import { DatasetCore } from "rdf-js";
import { dataset } from "@rdfjs/dataset";

export function browserPod(_fs?: FS, _dataset?: DatasetCore): Pod {
    const fs = _fs || (new Volume().promises as FS);
    return new DefaultPod(_dataset || dataset(), fs, window.fetch);
}
