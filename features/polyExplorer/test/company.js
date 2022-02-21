"use strict";

import assert from "assert";
import * as company from "../src/model/company.js";
import testGlobalJSON from "./testGlobal.js";
import oneCompany, { companiesJSON } from "./testCompanyData.js";
import { jurisdictions } from "../src/model/jurisdictions.js";

const i18n = {
    language: "en",
};

describe("Sample company", function () {
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

describe("Checks on companies", function () {
    it("Should not repeat ppids", function () {
        const ppids = companiesJSON.map((c) => c.ppid);
        assert.strictEqual(ppids.length, [...new Set(ppids)].length);
    });
    it("Should not repeat names", function () {
        const names = companiesJSON.map((c) => c.name);
        assert.strictEqual(names.length, [...new Set(names)].length);
    });
});

describe("Checks attributes", function () {
    it("Only known jurisdictions", () => {
        companiesJSON.map((c) => {
            assert.ok(Object.values(jurisdictions).includes(c.jurisdiction));
        });
    });
    it("Includes only known countries", () => {
        companiesJSON.map((c) => {
            if (c.location.countryCode) {
                assert.ok(
                    Object.keys(testGlobalJSON.countries).includes(
                        c.location.countryCode
                    )
                );
            }
        });
    });
});
