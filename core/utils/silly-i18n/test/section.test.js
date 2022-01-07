import {
    determineLanguage,
    LanguageError,
    NonExistingSectionError,
    TranslationKeyError,
    I18n,
    I18nSection,
} from "../src/index.js";

const LANGUAGE = "foo";
const FALLBACK_LANGUAGE = "en";
let i18n, i18ns;

beforeAll(() => {
    i18n = new I18n(LANGUAGE, {
        [LANGUAGE]: { quux: { bar: "baz" }, options: { opt: "{{opt}}" } },
    });
    i18ns = new I18nSection(i18n, "quux");
});

describe("Test basic configuration", () => {
    it("is created correctly", () => {
        expect(i18ns).toBeInstanceOf(I18nSection);
    });
    it("Translates correctly", () => {
        expect(i18ns.t("bar")).toBe("baz");
    });
    it("Throws when key not found", () => {
        let thrownError;
        try {
            i18ns.t("WAT");
        } catch (error) {
            thrownError = error;
        }
        expect(thrownError).toBeInstanceOf(TranslationKeyError);
        expect(thrownError.message).toEqual(
            expect.stringMatching(/do not have/)
        );
    });
});
