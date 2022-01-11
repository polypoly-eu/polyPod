import {
    determineLanguage,
    LanguageError,
    NonExistingSectionError,
    TranslationKeyError,
    I18n,
} from "../src/index.js";

const LANGUAGE = "foo";
const FALLBACK_LANGUAGE = "en";
let i18n;

const translationData = { quux: { bar: "baz" }, options: { opt: "{{opt}}" } };

beforeAll(() => {
    i18n = new I18n(LANGUAGE, {
        [LANGUAGE]: translationData,
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
    it("Includes all sections", () => {
        expect(i18n.sections()).toStrictEqual(Object.keys(translationData));
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

    it("Throws when the namespace does not exist", () => {
        let thrownError;
        try {
            i18n.t("WAT:WOOT");
        } catch (error) {
            thrownError = error;
        }
        expect(thrownError).toBeInstanceOf(NonExistingSectionError);
        expect(thrownError.message).toEqual(expect.stringMatching(/section/));
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

describe("Uses default fallback language correctly", () => {
    it("Picks up one of the keys by default", () => {
        const testI18n = new I18n("esperanto", {
            [LANGUAGE]: { quux: { bar: "baz" } },
        });
        expect(testI18n.language).toBe(LANGUAGE);
    });
    it("Uses fallback language", () => {
        const testI18n = new I18n(
            "esperanto",
            {
                [FALLBACK_LANGUAGE]: { quux: { bar: "baz" } },
            },
            FALLBACK_LANGUAGE
        );
        expect(testI18n.language).toBe(FALLBACK_LANGUAGE);
    });
});
