"use strict";

import assert from "assert";
import * as company from "../src/model/company.js";
import testCompanyJSON from "./testCompanyData.js";
import testGlobalJSON from "./testGlobal.js";

const i18n = {
    language: "en",
};

describe("Company", function () {
    const testCompany = new company.Company(
        testCompanyJSON,
        testGlobalJSON,
        i18n
    );

    it("City is parsed correctly", function () {
        assert.strictEqual(
            testCompany.location.city,
            testCompanyJSON.location.city
        );
    });

    it("CountryCode is parsed correctly", function () {
        assert.strictEqual(
            testCompany.location.countryCode,
            testCompanyJSON.location.countryCode
        );
    });

    it("Jurisdiction is parsed correctly", function () {
        assert.strictEqual(
            testCompany.jurisdiction,
            testCompanyJSON.jurisdiction
        );
    });

    it("AnnualRevenue is parsed correctly", function () {
        assert.strictEqual(
            testCompany.annualRevenues,
            testCompanyJSON.annualRevenues
        );
    });

    it("IndustryCategory is parsed correctly", function () {
        assert.strictEqual(
            testCompany.industryCategory,
            testCompanyJSON.industryCategory
        );
    });
});
