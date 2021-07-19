import {
    determineLanguage,
    LanguageError,
    TranslationKeyError,
    I18n,
} from "../src/index.js";

const LANGUAGE = "foo";
const FALLBACK_LANGUAGE = "en";
let i18n;

beforeAll(() => {
    i18n = new I18n(LANGUAGE, {
        [LANGUAGE]: { quux: { bar: "baz" }, options: { opt: "{{opt}}" } },
    });
});

describe("Test language determination", () => {
    it("finds a reasonable two-letter language", () => {
        expect(determineLanguage()).toEqual(expect.stringMatching(/\w{2,}/));
    });
});

describe("Test basic configuration", () => {
    it("is created correctly", () => {
        expect(i18n).toBeInstanceOf(I18n);
    });
    it("Translates correctly", () => {
        expect(i18n.t("quux:bar")).toBe("baz");
    });
    it("Throws when key does not have the correct format", () => {
        let thrownError;
        try {
            i18n.t("WAT");
        } catch (error) {
            thrownError = error;
        }
        expect(thrownError).toBeInstanceOf(TranslationKeyError);
        expect(thrownError.message).toEqual(expect.stringMatching(/format/));
    });

    it("Throws when key not found", () => {
        let thrownError;
        try {
            i18n.t("quux:WAT");
        } catch (error) {
            thrownError = error;
        }
        expect(thrownError).toBeInstanceOf(TranslationKeyError);
        expect(thrownError.message).toEqual(
            expect.stringMatching(/does not exist/)
        );
    });

    it("Uses options correctly", () => {
        expect(i18n.t("options:opt", { opt: "baz" })).toBe("baz");
    });
});

describe("Test constructor with faulty translation hash", () => {
    expect(() => {
        new I18n(
            "esperanto",
            {
                [LANGUAGE]: { quux: { bar: "baz" } },
            },
            "NoLang"
        );
    }).toThrow(LanguageError);
});
