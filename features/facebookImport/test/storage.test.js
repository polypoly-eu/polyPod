import JSZip from "jszip";
import { readFileSync } from "fs";

import Storage from "../src/model/storage.js";
import { expect } from "@jest/globals";
const noDataFileName = "no-data.txt";
const dataFileName = "src/static/commonStructure.json";
let testBuffer;
let storage;

beforeAll(() => {
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
    testBuffer = zipFile.generateNodeStream({ type: "nodebuffer" });
    storage = new Storage();
});

describe("Tests file storage", (done) => {
    it("Adds and removes a file correctly", () => {
        testBuffer
            .on("data", (data) => {
                const thisDate = new Date();
                storage.addFile({ data: data, time: thisDate });
                expect(storage.files.length).toBeGreaterThanOrEqual(1);
                expect(storage.files[0].data).toStrictEqual(data);
                storage.removeFile({ id: thisDate.getTime() });
                expect(storage.files.length).toBe(0);
            })
            .on("finish", () => {
                done();
            });
    });
});
