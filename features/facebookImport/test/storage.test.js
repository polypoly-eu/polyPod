import JSZip from "jszip";
import { createWriteStream, readFileSync } from "fs";

import Storage from "../src/model/storage.js";
import { expect } from "@jest/globals";

const noDataFileName = "no-data.txt";
const dataFileName = "src/static/commonStructure.json";
const zipFileName = `/tmp/test-${process.pid}.zip`;
let testStream;
let storage;

beforeAll((done) => {
    const zipFile = new JSZip();
    const structure = JSON.parse(readFileSync(dataFileName));

    for (let key in structure) {
        if (structure[key] === []) {
            zipFile.file(`${key}/${noDataFileName}`, "\n");
        } else {
            structure[key].forEach((element) => {
                zipFile.file(`${key}/${element}`, "[ 'foo' ]\n");
            });
        }
    }
    testStream = zipFile
        .generateNodeStream({ type: "nodebuffer" })
        .pipe(createWriteStream(zipFileName))
        .on("finish", () => {
            done();
        });
});

describe("Tests file storage", () => {
    it("Adds and removes a file correctly", (done) => {
        console.log("Fake test");
    });
});
