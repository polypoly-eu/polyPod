import JSZip from "jszip";
import { readFileSync, createWriteStream } from "fs";

import Storage from "../src/model/storage.js";
const dataFileName = "src/static/commonStructure.json";
const testFileName = "/tmp/fi-test.zip";
let storage;

beforeAll(() => {
    let zipFile = new JSZip();
    let structure = JSON.parse(readFileSync(dataFileName));

    for (let key in structure) {
        if (structure[key] === []) {
            zipFile.file(`${key}/${noDataFileName}`, "\n");
        } else {
            structure[key].forEach((element) => {
                zipFile.file(`${key}/${element}`, "[ 'foo' ]\n");
            });
        }
    }
    console.log(zipFile);
    zipFile
        .generateNodeStream({ type: "nodebuffer", streamFiles: true })
        .pipe(createWriteStream(testFileName));
    storage = new Storage();
});

describe("Tests file storage", () => {
    it("Adds a file correctly", () => {
        const thisFile = readFileSync(testFileName);
        console.log(thisFile);
        storage.addFile(thisFile);
    });
});
