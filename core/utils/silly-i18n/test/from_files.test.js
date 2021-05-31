import {
    determineLanguage,
    FileNotFoundError,
    I18n,
} from "../src/index.js";

beforeAll(() => {
//    i18n = I18n.fromFiles("test/locales");
});

describe("Test possible errors", () => {
    it("Throws when the directory does not exist", () => {
        let thrownError;
        try {
            I18n.fromFiles("WAT");
        } catch (error) {
            thrownError = error;
        }
        expect(thrownError).toBeInstanceOf(FileNotFoundError);
        expect(thrownError.message).toEqual(expect.stringMatching(/found/));
    });
});