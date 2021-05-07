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

    it("Company: ppid is parsed correctly", function () {
        assert.strictEqual(testCompany.ppid, testCompanyJSON.ppid);
    });

    it("Company: name is parsed correctly", function () {
        assert.strictEqual(testCompany.name, testCompanyJSON.name);
    });

    it("Company: featured tag is parsed correctly", function () {
        assert.strictEqual(testCompany.featured, testCompanyJSON.featured);
    });

    it("Company: city is parsed correctly", function () {
        assert.strictEqual(
            testCompany.location.city,
            testCompanyJSON.location.city
        );
    });

    it("Company: countryCode is parsed correctly", function () {
        assert.strictEqual(
            testCompany.location.countryCode,
            testCompanyJSON.location.countryCode
        );
    });

    it("Company: jurisdiction is parsed correctly", function () {
        assert.strictEqual(
            testCompany.jurisdiction,
            testCompanyJSON.jurisdiction
        );
    });

    it("Company: annualRevenue is parsed correctly", function () {
        assert.strictEqual(
            testCompany.annualRevenues,
            testCompanyJSON.annualRevenues
        );
    });

    it("Company: dataRecipients is parsed correctly", function () {
        assert.strictEqual(
            testCompany.dataRecipients,
            testCompanyJSON.dataRecipients
        );
    });

    it("Company: datasharingPurposes is parsed correctly", function () {
        assert.strictEqual(
            testCompany.dataSharingPurposes,
            testCompanyJSON.dataSharingPurposes
        );
    });

    it("Company: dataTypesShared is parsed correctly", function () {
        assert.strictEqual(
            testCompany.dataTypesShared,
            testCompanyJSON.dataTypesShared
        );
    });

    it("Company: jurisdictionsShared is parsed correctly", function () {
        assert.strictEqual(
            testCompany.jurisdictionsShared,
            testCompanyJSON.jurisdictionsShared
        );
    });

    it("Company: industryCategory is parsed correctly", function () {
        assert.strictEqual(
            testCompany.industryCategory,
            testCompanyJSON.industryCategory
        );
    });

    it("Company: description is parsed correctly", function () {
        assert.strictEqual(
            testCompany.description,
            testCompanyJSON.description
        );
    });

    it("Company: nameIndexCharacter only gives one character", function () {
        assert.strictEqual(testCompany.nameIndexCharacter.length, 1);
    });

    it("Company: nameIndexCharacter has no special characters", function () {
        assert(!specialCharacters.test(testCompany.nameIndexCharacter));
    });

    const stringPatterns = ["%$%AAA", "!%$&ABC", "T", "()zz", "[]ZZZ"];

    for (let i = 0; i < stringPatterns.length - 1; i++) {
        console.log(createTestCompany(stringPatterns[i]).name);
        console.log(createTestCompany(stringPatterns[i + 1]).name);
        it("Company: compareNames() works", function () {
            assert(
                createTestCompany(stringPatterns[i]).compareNames(
                    createTestCompany(stringPatterns[i + 1])
                ) < 0
            );
        });
    }
});
