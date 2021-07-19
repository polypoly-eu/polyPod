import i18n from "../src/i18n.js";

describe("Test i18n object", () => {
    it("has been created correctly", () => {
        expect(i18n).toBeDefined();
        expect(i18n).toHaveProperty("language");
        expect(i18n).toHaveProperty("_translations");
    });
});
