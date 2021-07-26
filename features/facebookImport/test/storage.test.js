import JSZip from "jszip";
import { readFileSync } from "fs";

import Storage from "../src/model/storage.js";
import { expect } from "@jest/globals";
import { dataset } from "@rdfjs/dataset";
import fetch from "node-fetch";
import { Volume } from "memfs";
import { DefaultPod } from "@polypoly-eu/pod-api";

const noDataFileName = "no-data.txt";
const dataFileName = "src/static/commonStructure.json";
let testStream;
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
    testStream = zipFile.generateNodeStream({ type: "nodebuffer" });
    storage = new Storage(
        new DefaultPod(dataset(), new Volume().promises, fetch)
    );
});

describe("Tests file storage", () => {
    it("Adds and removes a file correctly", () => {
        let theseBytes = Buffer.from([]);
        testStream
            .on("data", (data) => {
                theseBytes = Buffer.concat([theseBytes, data]);
            })
            .on("end", () => {
                const thisDate = new Date();
                storage
                    .addFile({ data: theseBytes, time: thisDate })
                    .then(() => {
                        expect(storage.files.length).toBeGreaterThanOrEqual(1);
                        expect([...storage.files[0].data]).toEqual([
                            ...theseBytes.values(),
                        ]);
                    });
            });
    });
});
