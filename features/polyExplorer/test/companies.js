"use strict";

import assert from "assert";
import * as companies from "../src/companies.js";

describe("companies", function () {
    it("Special char first letter detection works", function () {
        const specialCharString = "#";
        const numberCharString = "1";
        const letterCharString = "a";
        assert(companies.startsWithSpecialChar(specialCharString));
        assert(!companies.startsWithSpecialChar(numberCharString));
        assert(!companies.startsWithSpecialChar(letterCharString));
    });

    it("String sort comparison works", function () {
        const strings = ["#*'§12", "%/$$ab", "abc", "%/{&/z", "z"];
        assert(companies.compare(strings[0], strings[1]) < 0);
        assert(companies.compare(strings[1], strings[0]) > 0);
        assert(companies.compare(strings[1], strings[2]) < 0);
        assert(companies.compare(strings[2], strings[3]) < 0);
        assert(companies.compare(strings[3], strings[4]) == 0);
    });
});
