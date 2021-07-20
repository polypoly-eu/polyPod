import JSZip from "jszip";
import fs from "fs";

import { commonKeys } from "../src/globals.js";

let zipFile = new JSZip();
const dataFileName = "fi-test.zip";

commonKeys().forEach((element) => {
    if (element.includes(".json")) {
        zipFile.file(element, "[ 'foo' ]\n");
    } else {
        zipFile.file(`${element}/no_data.txt`, "\n");
    }
});

zipFile
    .generateNodeStream({ type: "nodebuffer", streamFiles: true })
    .pipe(fs.createWriteStream(dataFileName))
    .on("finish", function () {
        console.log(`${dataFileName} written.`);
    });
