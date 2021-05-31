import {
    determineLanguage,
    FileNotFoundError,
    I18n,
} from "../src/index.js";

beforeAll(async () => {
    i18n = await I18n.fromFiles("test/locales");
});

describe("Test possible errors", () => {
    it("Throws when the directory does not exist", () => {
        I18n.fromFiles("WAT").catch( (error) => {
            console.log(error);
            expect(error).toBeInstanceOf(FileNotFoundError);
//            expect(error).toEqual(expect.stringMatching(/found/));
        });
    });
});