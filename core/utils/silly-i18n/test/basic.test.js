import {determineLanguage, I18n} from "../src/index.js";

describe( "Test basic configuration", () => {

    it( "is created correctly", () => {
        const i18n = new I18n( "foo", { "foo": { "bar": "baz" }})
    })
});