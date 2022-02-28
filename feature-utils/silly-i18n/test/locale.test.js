import { determineLanguage, determineLocale } from "../src/locale";

describe("Test language and locale determination", () => {
    it("finds a reasonable locale", () => {
        expect(determineLocale()).toEqual(expect.stringMatching(/^\w{2,}-\w+/));
    });
    it("finds a reasonable two-letter language", () => {
        expect(determineLanguage()).toEqual(expect.stringMatching(/^\w{2,}/));
    });
});
