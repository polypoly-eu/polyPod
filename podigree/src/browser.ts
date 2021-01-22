import type { FS, Pod } from "@polypoly-eu/poly-api";
import type { EncodingOptions, Stats } from "@polypoly-eu/poly-api";
import { DefaultPod } from "@polypoly-eu/poly-api";
//import { Volume } from "memfs";
import { DatasetCore } from "rdf-js";
import { dataset } from "@rdfjs/dataset";

export function browserPod(_fs?: FS, _dataset?: DatasetCore): Pod {
    // TODO: This introduces the stupid issue where the process object is being accessed in orodruin/container.js
    //const fs = _fs || (new Volume().promises as FS);
    const fs = {
	readFile(path: string, options: EncodingOptions): Promise<string> {
	    return new Promise(function(resolve, reject) {
		resolve("");
	    });
	},
	writeFile(path: string, content: string, options: EncodingOptions): Promise<void> {
	    return new Promise(function(resolve, reject) {
		resolve();
	    });
	},

	stat(path: string): Promise<Stats> {
	    return new Promise(function(resolve, reject) {
		resolve({
		    isFile(): boolean {
			return false;
		    },
		    isDirectory(): boolean {
			return false;
		    }
		});
	    });
	},

	readdir(path: string): Promise<string[]> {
	    return new Promise(function(resolve, reject) {
		resolve([]);
	    });
	}
    } as FS;

    return new DefaultPod(_dataset || dataset(), fs, window.fetch);
}
