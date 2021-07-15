import { commonKeys } from "../src/globals.js";

let importedCommonKeys;

beforeAll(() => {
    importedCommonKeys = commonKeys();
});

describe("Test basic configuration", () => {
    it("includes expected keys", () => {
        expect(importedCommonKeys).toBeDefined();
        ['events','pages','privacy_checkup'].forEach( (key) => {
            expect(importedCommonKeys).toContain( key );
        });
    });
});
