import { determineLanguage, LanguageError, I18n } from "../src/index.js";

const LANGUAGE = "foo";
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
    it("Throws when key not found", () => {
        expect(() => {
            i18n.t("WAT");
        }).toThrow(Error);
    });
    it("Uses options correctly", () => {
        expect(i18n.t("options:opt", { opt: "baz" })).toBe("baz");
    });
});

describe("Test constructor with faulty translation hash", () => {
    expect( () => {
        new I18n("esperanto", {
            [LANGUAGE]: { quux: { bar: "baz" } },
        });
    }).toThrow(LanguageError)
});
