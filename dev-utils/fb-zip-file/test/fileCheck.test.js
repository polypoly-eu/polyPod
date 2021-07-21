import { commonStructure } from "../src/globals.js";
import { FiFileChecker } from "../src/fi-file-checker";

let fileChecker;

beforeAll(() => {
    fileChecker = new FiFileChecker(Object.keys(commonStructure()));
});

describe("Tautological test", () => {
    it("common keys should check", () => {
        expect(fileChecker.checkStructure(Object.keys(commonStructure()))).toBe(
            true
        );
    });
});
