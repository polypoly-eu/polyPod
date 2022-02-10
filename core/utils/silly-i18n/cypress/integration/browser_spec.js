import { determineLanguage, determineLocale } from "../../src/locale.js";
import { I18n } from "../../src/index.js";

const LANGUAGE = "foo";
let i18n;

beforeEach(() => {
    i18n = new I18n(LANGUAGE, {
        [LANGUAGE]: { quux: { bar: "baz" }, options: { opt: "{{opt}}" } },
    });
});

describe("Test language determination", () => {
    it("finds a reasonable two-letter language", () => {
        expect(determineLocale()).to.match(/^\w{2,}-\w+/);
        expect(determineLanguage()).to.match(/^\w{2,}$/);
    });

    it("is able to create the object in a web environment", () => {
        expect(i18n).to.have.keys(["_locale", "language", "_translations"]);
        expect(i18n.language).to.equal(LANGUAGE);
    });
});

describe("Test locale numeric options correctly", () => {
    it("Converts big numbers to locale format", () => {
        const bigNumber = "1000000.33";
        const localePairs = {
            "de-DE": "1.000.000,33",
            "es-ES": "1.000.000,33",
            "en-GB": "1,000,000.33",
        };
        for (const [locale, l8nString] of Object.entries(localePairs)) {
            i18n._locale = locale;
            expect(i18n.t("options:opt", { opt: bigNumber })).to.equal(
                l8nString
            );
        }
    });
});
