import JSZip from "jszip";
import { readFileSync } from "fs";

import Checks from "../src/model/facebook-checks.js";
import { expect } from "@jest/globals";
import FacebookChecks from "../src/model/facebook-checks.js";

const noDataFileName = "no-data.txt";
const dataFileName = "src/static/commonStructure.json";
let checks;
let zipFileMock = [];

beforeAll(() => {
    const structure = JSON.parse(readFileSync(dataFileName));
    for (let key in structure) {
        if (structure[key] === []) {
            zipFileMock.push({ name: `${key}/${noDataFileName}` });
        } else {
            structure[key].forEach((element) => {
                zipFileMock.push({
                    name: `${key}/${element.replace("json", "html")}`,
                });
            });
        }
    }
    checks = new FacebookChecks(zipFileMock);
});

describe("Tests zip file structure checks", () => {
    it("passes basic tests", () => {
        expect(checks.files).toHaveLength(zipFileMock.length);
    });

    it("detects it's got HTML files in it", () => {
        expect(checks.isItHTMLExport()).toBe(true);
    });
});
