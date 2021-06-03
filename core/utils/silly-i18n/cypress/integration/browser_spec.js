import {
    determineLanguage,
    LanguageError,
    TranslationKeyError,
    I18n,
} from "../../src/index.js";

describe("Test language determination", () => {
    it("finds a reasonable two-letter language", () => {
        expect(determineLanguage()).toEqual(expect.stringMatching(/\w{2,}/));
    });
});