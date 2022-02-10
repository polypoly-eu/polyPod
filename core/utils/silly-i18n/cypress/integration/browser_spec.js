import { determineLanguage, determineLocale } from "../../src/locale.js";
import { I18n } from "../../src/index.js";

const LANGUAGE = "foo";

describe("Test language determination", () => {
    it("finds a reasonable two-letter language", () => {
        expect(determineLocale()).to.match(/^\w{2,}-\w+/);
        expect(determineLanguage()).to.match(/^\w{2,}$/);
    });

    it("is able to create the object in a web environment", () => {
        const i18n = new I18n(LANGUAGE, {
            [LANGUAGE]: { quux: { bar: "baz" }, options: { opt: "{{opt}}" } },
        });
        expect(i18n).to.have.keys(["_locale", "language", "_translations"]);
        expect(i18n.language).to.equal(LANGUAGE);
    });
});
