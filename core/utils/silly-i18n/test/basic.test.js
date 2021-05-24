import { I18n } from "../src/index.js";

const LANGUAGE = "foo";
let i18n;

beforeAll(() => {
    i18n = new I18n(LANGUAGE, { [LANGUAGE]: { quux: { bar: "baz" } } });
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
});
