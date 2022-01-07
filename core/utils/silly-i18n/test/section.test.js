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
});
