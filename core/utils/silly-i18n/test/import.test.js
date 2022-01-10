import {
    createI18n,
    I18n
} from "../src/index.js";

import path from "path";

let i18n;

beforeAll(async () => {
    const thisPath = path.resolve("./test/test-data");
    i18n = await createI18n(["numbers"],['en','de','es'], thisPath);
});

describe( "Loads sections", () => {
    it( "Is instantiated to a language ", () => {
        expect(i18n).toBeInstanceOf(I18n);
    })
})