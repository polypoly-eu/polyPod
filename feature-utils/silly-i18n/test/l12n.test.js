import { LanguageError } from "../src/errors";
import { L12n } from "../src/l12n";

let l12n;
const bigNumber = "1000000.33";
const localePairs = {
    "de-DE": "1.000.000,33",
    "es-ES": "1.000.000,33",
    "en-GB": "1,000,000.33",
};

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
        for (const [locale, l12nString] of Object.entries(localePairs)) {
            const localeHere = new L12n(locale);
            expect(localeHere.locale).toEqual(locale);
            expect(localeHere.t(bigNumber)).toEqual(l12nString);
        }
    });
});
