import { FileNotFoundError, I18n } from "../src/index.js";

let i18n;

beforeAll(async () => {
    i18n = I18n.fromFiles("test/locales");
});

describe("Tests static file reading", () => {
    it("Gets all files", async () => {
        expect((I18n.getAllFilePaths("test/locales")).length).toEqual(3);
    });
});

describe("Test existing keys", () => {
    it("Has the right amount of keys", () => {
        expect(i18n.namespaces.length).toEqual(1);
    });

    it("can be created the right amount of keys", () => {
        const i18nNew = I18n.fromFiles("test/locales");
        expect(i18nNew.namespaces.length).toEqual(1);
    });
});

describe("Test possible errors", () => {
    it("Throws when the directory does not exist", () => {
        try { 
            I18n.fromFiles("WAT")
        } catch (error) {
            expect(error).toBeInstanceOf(FileNotFoundError);
            expect(error.message).toEqual(expect.stringMatching(/found/));
        };
    });
    it("Throws when the argument is not a directory", () => {
        try {
            I18n.fromFiles("test/locales/es/common.json")
        } catch (error) {
            expect(error).toBeInstanceOf(FileNotFoundError);
            expect(error.message).toEqual(expect.stringMatching(/not really/));
        };
    });
});
