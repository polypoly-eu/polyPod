import { TranslationKeyError, NonExistingSectionError, I18n, I18nSection } from "../src/index.js";

const LANGUAGE = "foo";
let i18n, i18ns;
const translationData = { quux: { bar: "baz" }, options: { opt: "{{opt}}" } };

beforeAll(() => {
    i18n = new I18n(LANGUAGE, {
        [LANGUAGE]: translationData,
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
            expect.stringMatching(/does not have/)
        );
    });

    
});

describe("Throws if there's an error", () => {
    it ( "Throws the correct exception ", () => {
        let thrownError;
        try {
            i18ns = new I18nSection(i18n, "zuul");
        } catch (error) {
            thrownError = error;
        }
        expect(thrownError).toBeInstanceOf(NonExistingSectionError);
        expect(thrownError.message).toEqual(
            expect.stringMatching(/is not included/)
        );
})
});
