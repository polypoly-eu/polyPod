"use strict";

import assert from "assert";
import * as company from "../src/model/company.js";
import testGlobalJSON from "./testGlobal.js";
import oneCompany from "./testCompanyData.js";

const i18n = {
    language: "en",
};

describe("Company", function () {
    const testCompany = new company.Company(oneCompany, testGlobalJSON, i18n);

    it("City is parsed correctly", function () {
        assert.strictEqual(testCompany.location.city, oneCompany.location.city);
    });

    it("CountryCode is parsed correctly", function () {
        assert.strictEqual(
            testCompany.location.countryCode,
            oneCompany.location.countryCode
        );
    });

    it("Jurisdiction is parsed correctly", function () {
        assert.strictEqual(testCompany.jurisdiction, oneCompany.jurisdiction);
    });

    it("AnnualRevenue is parsed correctly", function () {
        assert.strictEqual(
            testCompany.annualRevenues,
            oneCompany.annualRevenues
        );
    });

    it("IndustryCategory is parsed correctly", function () {
        assert.strictEqual(
            testCompany.industryCategory,
            oneCompany.industryCategory
        );
    });
});
