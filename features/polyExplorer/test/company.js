"use strict";

import assert from "assert";
import * as company from "../src/company.js";

describe("companies", function () {
    it("String sort comparison works", function () {
        const strings = ["#*'§12", "%/$$ab", "abc", "%/{&/z", "z"];
        assert(companies.compare(strings[0], strings[1]) < 0);
        assert(companies.compare(strings[1], strings[0]) > 0);
        assert(companies.compare(strings[1], strings[2]) < 0);
        assert(companies.compare(strings[2], strings[3]) < 0);
        assert(companies.compare(strings[3], strings[4]) == 0);
    });
});
