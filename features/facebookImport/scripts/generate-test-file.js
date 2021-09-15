import JSZip from "jszip";
import fs from "fs";

import structure from "../src/static/commonStructure.js";
import { noDataFileName } from "../src/globals/index.js";

let zipFile = new JSZip();
const dataFileName = "fi-test.zip";

for (let item of structure) {
    if (!item.match(/\.json$/)) {
        zipFile.file(`${item}/${noDataFileName}`, "\n");
    } else {
        zipFile.file(item, "[ 'foo' ]\n");
    }
}

zipFile
    .generateNodeStream({ type: "nodebuffer", streamFiles: true })
    .pipe(fs.createWriteStream(dataFileName))
    .on("finish", function () {
        console.log(`${dataFileName} written.`);
    });
