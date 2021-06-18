import {
    determineLanguage,
    I18n,
} from "../../src/index.js";

const LANGUAGE = "foo";

describe("Test language determination", () => {
    it("finds a reasonable two-letter language", () => {
        expect(determineLanguage()).to.match(/^\w{2,}$/);
    });

    it("is able to create the object in a web environment", () => {
        const i18n = new I18n(LANGUAGE, {
            [LANGUAGE]: { quux: { bar: "baz" }, options: { opt: "{{opt}}" } },
        });
        expect(i18n).to.have.keys(["language", "_translations"]);
        expect(i18n.language).to.equal(LANGUAGE);
    });
});
