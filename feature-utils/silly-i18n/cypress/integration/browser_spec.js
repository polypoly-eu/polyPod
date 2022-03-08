import { determineLanguage, determineLocale } from "../../src/locale.js";
import { I18n } from "../../src/index.js";
import { L12n } from "../../src/l12n.js";

import {
    bigNumber,
    numberPairs,
    date,
    datePairs,
} from "../../test/test-utils.js";

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
        expect(i18n).to.have.keys(["_l12n", "language", "_translations"]);
        expect(i18n.language).to.equal(LANGUAGE);
    });
});

describe("Test locale options correctly in its module", () => {
    it("Converts big numbers to locale format", () => {
        for (const [locale, l12nString] of Object.entries(numberPairs)) {
            const localeHere = new L12n(locale);
            expect(localeHere.locale).to.equal(locale);
            expect(localeHere.t(bigNumber)).to.equal(l12nString);
        }
    });

    it("Converts dates to locale format", () => {
        for (const [locale, l12nDate] of Object.entries(datePairs)) {
            const localeHere = new L12n(locale);
            expect(localeHere.t(date)).to.equal(l12nDate);
        }
    });
});

describe("Test locale numeric options correctly", () => {
    it("Converts big numbers to locale format", () => {
        for (const [locale, l8nString] of Object.entries(numberPairs)) {
            i18n._l12n = new L12n(locale);
            expect(i18n.locale).to.equal(locale);
            expect(i18n.t("options:opt", { opt: bigNumber })).to.equal(
                l8nString
            );
        }
    });
});
