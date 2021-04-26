"use strict";

import assert from "assert";
import * as company from "../src/company.js";

describe("company", function () {
    const strings = ["#*'§12", "%/$$ab", "abc", "%/{&/z", "z"];

    it("String sort comparison works", function () {
        assert(company.compare(strings[0], strings[1]) < 0);
        assert(company.compare(strings[1], strings[0]) > 0);
        assert(company.compare(strings[1], strings[2]) < 0);
        assert(company.compare(strings[2], strings[3]) < 0);
        assert(company.compare(strings[3], strings[4]) == 0);
    });

    it("String first character assessment works", function () {
        assert(company.getFirstNormalCharacter(strings[0]) === "1");
        assert(company.getFirstNormalCharacter(strings[1]) === "a");
        assert(company.getFirstNormalCharacter(strings[2]) === "a");
        assert(company.getFirstNormalCharacter(strings[3]) === "z");
        assert(company.getFirstNormalCharacter(strings[4]) === "z");
    });
});
