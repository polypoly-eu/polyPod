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
    it("throws correctly if locale is incorrect ", () => {
        let thrownError;
        try {
            new L12n("WAT");
        } catch (error) {
            thrownError = error;
        }
        console.log(thrownError);
        expect(thrownError).toBeInstanceOf(LanguageError);
        expect(thrownError.message).toEqual(expect.stringMatching(/format/));
    });
});
