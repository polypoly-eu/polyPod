import { FileNotFoundError, I18n } from "../src/index.js";

let i18n;

beforeAll(async () => {
    i18n = await I18n.fromFiles("test/locales");
});

describe("Test existing keys", () => {
    it("Has the right amount of keys", () => {
        expect(i18n.namespaces.length).toEqual(1);
    });

    it("can be created the right amount of keys", async () => {
        const i18nNew = await I18n.fromFiles("test/locales");
        expect(i18nNew.namespaces.length).toEqual(1);
    });
});

describe("Test possible errors", () => {
    it("Throws when the directory does not exist", () => {
        I18n.fromFiles("WAT").catch((error) => {
            console.log(error);
            expect(error).toBeInstanceOf(FileNotFoundError);
            expect(error.message).toEqual(expect.stringMatching(/found/));
        });
    });
    it("Throws when the argument is not a directory", () => {
        I18n.fromFiles("test/locales/es/common.json").catch((error) => {
            console.log(error);
            expect(error).toBeInstanceOf(FileNotFoundError);
            expect(error.message).toEqual(expect.stringMatching(/not really/));
        });
    });
});
