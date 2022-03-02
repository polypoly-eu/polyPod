import { I18n } from "../src/index.js";

import {
    LanguageError,
    NonExistingSectionError,
    TranslationKeyError,
} from "../src/errors";

import { bigNumber, localePairs } from "./test-utils.js";
import { L12n } from "../src/l12n.js";

const LANGUAGE = "foo";
const FALLBACK_LANGUAGE = "en";
let i18n;

const translationData = { quux: { bar: "baz" }, template: { opt: "{{opt}}" } };

beforeAll(() => {
    i18n = new I18n(LANGUAGE, {
        [LANGUAGE]: translationData,
    });
});

describe("Test basic configuration", () => {
    it("is created correctly", () => {
        expect(i18n).toBeInstanceOf(I18n);
    });
    it("Includes all attributes", () => {
        expect(i18n.sections).toStrictEqual(Object.keys(translationData));
        expect(i18n.locale).toEqual(expect.stringMatching(/^\w+-\w+/));
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
        expect(i18n.t("template:opt", { opt: "baz" })).toBe("baz");
    });
});

describe("Test locale numeric options correctly", () => {
    it("Converts big numbers to locale format", () => {
        for (const [locale, l8nString] of Object.entries(localePairs)) {
            i18n._l12n = new L12n(locale);
            expect(i18n.t("template:opt", { opt: bigNumber })).toBe(l8nString);
        }
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
