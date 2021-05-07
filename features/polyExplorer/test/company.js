"use strict";

import assert from "assert";
import * as company from "../src/model/company.js";
import testCompanyJSON from "./testCompanyData.js";
import testGlobalJSON from "./testGlobal.js";

describe("company", function () {
    const specialCharacters = /[!@#$%^&*()_+\-=[\]{};':"\\|<>?]+/;

    function createTestCompany(name) {
        const aTestCompanyJSON = { ...testCompanyJSON };
        aTestCompanyJSON.name = name;
        return new company.Company(aTestCompanyJSON, testGlobalJSON);
    }

    const testCompany = new company.Company(testCompanyJSON, testGlobalJSON);

    it("ppid is parsed correctly", function () {
        assert.strictEqual(testCompany.ppid, testCompanyJSON.ppid);
    });

    it("Name is parsed correctly", function () {
        assert.strictEqual(testCompany.name, testCompanyJSON.name);
    });

    it("Featured tag is parsed correctly", function () {
        assert.strictEqual(testCompany.featured, testCompanyJSON.featured);
    });

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

    it("DataRecipients is parsed correctly", function () {
        assert.strictEqual(
            testCompany.dataRecipients,
            testCompanyJSON.dataRecipients
        );
    });

    it("DatasharingPurposes is parsed correctly", function () {
        assert.strictEqual(
            testCompany.dataSharingPurposes,
            testCompanyJSON.dataSharingPurposes
        );
    });

    it("DataTypesShared is parsed correctly", function () {
        assert.strictEqual(
            testCompany.dataTypesShared,
            testCompanyJSON.dataTypesShared
        );
    });

    it("JurisdictionsShared is parsed correctly", function () {
        assert.strictEqual(
            testCompany.jurisdictionsShared,
            testCompanyJSON.jurisdictionsShared
        );
    });

    it("IndustryCategory is parsed correctly", function () {
        assert.strictEqual(
            testCompany.industryCategory,
            testCompanyJSON.industryCategory
        );
    });

    it("Description is parsed correctly", function () {
        assert.strictEqual(
            testCompany.description,
            testCompanyJSON.description
        );
    });

    it("NameIndexCharacter only gives one character", function () {
        assert.strictEqual(testCompany.nameIndexCharacter.length, 1);
    });

    it("NameIndexCharacter has no special characters", function () {
        assert(!specialCharacters.test(testCompany.nameIndexCharacter));
    });

    const stringPatterns = ["%$%AAA", "!%$&ABC", "T", "()zz", "[]ZZZ"];

    for (let i = 0; i < stringPatterns.length - 1; i++) {
        it("CompareNames() works", function () {
            assert(
                createTestCompany(stringPatterns[i]).compareNames(
                    createTestCompany(stringPatterns[i + 1])
                ) < 0
            );
        });
    }
});
