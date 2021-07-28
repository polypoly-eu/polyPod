import { readAndProcessZipFile } from "../src/globals.js";

function importStructure(zip) {
    let structure = {};
    const files = Object.keys(zip.files).sort();
    for (let key of files) {
        const fragments = key.split("/");
        const thisFile = zip.files[key];
        if (thisFile["dir"]) {
            if (fragments.length === 2) {
                structure[fragments[0]] = { leaves: [] };
            } else if (fragments.length === 3) {
                structure[fragments[0]][fragments[1]] = { leaves: [] };
            } else if (fragments.length === 4) {
                structure[fragments[0]][fragments[1]][fragments[2]] = {
                    leaves: [],
                };
            } else if (fragments.length === 5) {
                structure[fragments[0]][fragments[1]][fragments[2]][
                    fragments[3]
                ] = { leaves: [] };
            } else if (fragments.length === 6) {
                structure[fragments[0]][fragments[1]][fragments[2]][
                    fragments[3]
                ][fragments[4]] = { leaves: [] };
            }
        } else {
            if (fragments.length === 2) {
                structure[fragments[0]]["leaves"].push(fragments[1]);
            } else if (fragments.length === 3) {
                structure[fragments[0]][fragments[1]]["leaves"].push(
                    fragments[2]
                );
            } else if (fragments.length === 4) {
                structure[fragments[0]][fragments[1]][fragments[2]][
                    "leaves"
                ].push(fragments[3]);
            } else if (fragments.length === 5) {
                structure[fragments[0]][fragments[1]][fragments[2]][
                    fragments[3]
                ]["leaves"].push(fragments[4]);
            } else if (fragments.length === 6) {
                structure[fragments[0]][fragments[1]][fragments[2]][
                    fragments[3]
                ][fragments[4]]["leaves"].push(fragments[5]);
            }
        }
    }
    console.log(JSON.stringify(structure));
}

readAndProcessZipFile(importStructure);
