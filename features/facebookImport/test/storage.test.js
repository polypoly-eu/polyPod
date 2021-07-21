import JSZip from "jszip";
import { readFileSync, createWriteStream } from "fs";

const tempDir = "RUNNER_TEMP" in process.env ? process.env.RUNNER_TEMP : "/tmp";
import Storage from "../src/model/storage.js";
import { expect } from "@jest/globals";
const noDataFileName = "no-data.txt";
const dataFileName = "src/static/commonStructure.json";
const testFileName = `${tempDir}/fi-test.zip`;
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
    zipFile
        .generateNodeStream({ type: "nodebuffer", streamFiles: true })
        .pipe(createWriteStream(testFileName));
    storage = new Storage();
});

describe("Tests file storage", () => {
    it("Adds and removes a file correctly", () => {
        const thisFile = readFileSync(testFileName);
        const thisDate = new Date();
        storage.addFile({ data: thisFile, time: thisDate });
        expect(storage.files.length).toBeGreaterThanOrEqual(1);
        expect(storage.files[0].data).toStrictEqual(thisFile);
        storage.removeFile({ id: thisDate.getTime() });
        expect(storage.files.length).toBe(0);
    });
});
