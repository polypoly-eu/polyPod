import { commonStructure } from "../src/globals.js";

let importedCommonStructure;

beforeAll(() => {
    importedCommonStructure = commonStructure();
});

describe("Test basic configuration", () => {
    it("includes expected keys", () => {
        expect(importedCommonStructure).toBeDefined();
        ["events", "pages", "privacy_checkup"].forEach((key) => {
            expect(Object.keys(importedCommonStructure)).toContain(key);
        });
    });
});
