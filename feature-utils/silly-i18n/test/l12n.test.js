import { LanguageError } from "../src/errors";
import { L12n } from "../src/l12n";
import { bigNumber, numberPairs, date, datePairs } from "./test-utils.js";

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

describe("It's able to translate objects correctly", () => {
    it("is able to convert numbers and dates to a known format", () => {
        for (const locale in numberPairs) {
            const localeHere = new L12n(locale);
            expect(localeHere.locale).toEqual(locale);
            const l12nString = numberPairs[locale];
            expect(localeHere.t(bigNumber)).toEqual(l12nString);
            const l12nDate = datePairs[locale];
            expect(localeHere.t(date)).toEqual(l12nDate);
        }
    });

    it("passes through non-number objects without a glitch", () => {
        const foobar = "foobar";
        for (const locale in numberPairs) {
            const localeHere = new L12n(locale);
            expect(localeHere.t(foobar)).toEqual(foobar);
        }
    });
});
