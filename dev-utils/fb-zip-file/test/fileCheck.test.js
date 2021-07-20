import { commonKeys } from "../src/globals.js";
import { FiFileChecker } from "../src/fi-file-checker";

let fileChecker;

beforeAll(() => {
    fileChecker = new FiFileChecker( commonKeys() );
});

describe("Tautological test", () => {
    it("common keys should check", () => {
        expect(fileChecker.checkStructure(commonKeys())).toBe(true);
    });
});
