import { LanguageError } from "../src/errors";
import { L12n } from "../src/l12n";

let l12n;

beforeAll(() => {
    l12n = new L12n();
});

describe("Test correct and incorrect locales", () => {
    it("has a reasonable locale", () => {
        expect(l12n.locale).toMatch(/^\w{2}/);
    });
    it("throws correctly if locale has incorrect format ", () => {
        let thrownError;
        try {
            new L12n("WAT");
        } catch (error) {
            thrownError = error;
        }
        expect(thrownError).toBeInstanceOf(LanguageError);
        expect(thrownError.message).toEqual(expect.stringMatching(/format/));
    });
    it("throws correctly if locale does not support numeric format ", () => {
        let thrownError;
        try {
            new L12n("wa_WA");
        } catch (error) {
            thrownError = error;
        }
        expect(thrownError).toBeInstanceOf(LanguageError);
        expect(thrownError.message).toEqual(
            expect.stringMatching(/supported locale/)
        );
    });
});

describe("It's able to translate numbers correctly", () => {
    it("is able to convert number to a known format", () => {
        const enLocale = "en";
        const enL12n = new L12n(enLocale);
        expect(enL12n.locale).toBe(enLocale);
        expect(enL12n.t(33333)).toBe("33,333");
    });
});
