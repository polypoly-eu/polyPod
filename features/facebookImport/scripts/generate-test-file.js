import JSZip from "jszip";
import fs from "fs";

import { commonStructure, noDataFileName } from "../src/globals.js";

let zipFile = new JSZip();
const dataFileName = "fi-test.zip";
let structure = commonStructure();

for (let key in structure) {
    if (!structure[key].length) {
        zipFile.file(`${key}/${noDataFileName}`, "\n");
    } else {
        structure[key].forEach((element) => {
            zipFile.file(`${key}/${element}`, "[ 'foo' ]\n");
        });
    }
}

zipFile
    .generateNodeStream({ type: "nodebuffer", streamFiles: true })
    .pipe(fs.createWriteStream(dataFileName))
    .on("finish", function () {
        console.log(`${dataFileName} written.`);
    });
