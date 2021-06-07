"use strict";

import assert from "assert";
import i18n from "../src/i18n.js";

describe("i18n framework", () => {
    it( "Includes used keys", () => {
        [
            "infoScreen:headline.aggregation",
            "mainScreen:tab.featuredCompanies",
            "infographic:featuredCompany.text1"
        ].forEach( (key) => {
            assert(i18n.t(key))
        })
    } );
});
