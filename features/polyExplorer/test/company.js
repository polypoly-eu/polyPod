"use strict";

import assert from "assert";
import * as company from "../src/company.js";
import testCompanyJSON from "./testCompanyData.js";
import testGlobalJSON from "./testGlobal.js";

describe("company", function () {
    const testCompany = new company.Company(testCompanyJSON, testGlobalJSON);
    const testCompanyJSONModified = { ...testCompanyJSON };
    testCompanyJSONModified.name = "%%Az";
    const testCompany2 = new company.Company(
        testCompanyJSONModified,
        testGlobalJSON
    );
    const specialCharacters = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]+/;

    it("Company: getters work", function () {
        //Activate this when ppid exists
        //assert(testCompany.ppid === testCompanyJSON.ppid)
        assert(testCompany.name === testCompanyJSON.name);
        assert(testCompany.featured === testCompanyJSON.featured);
        assert(testCompany.jurisdiction === testCompanyJSON.jurisdiction);
        assert(testCompany.location.city === testCompanyJSON.location.city);
        assert(
            testCompany.location.countryCode ===
                testCompanyJSON.location.countryCode
        );
        assert(testCompany.annualRevenues === testCompanyJSON.annualRevenues);
        assert(testCompany.dataRecipients === testCompanyJSON.dataRecipients);
        assert(
            testCompany.dataSharingPurposes ===
                testCompanyJSON.dataSharingPurposes
        );
        assert(testCompany.dataTypesShared === testCompanyJSON.dataTypesShared);
        assert(
            testCompany.jurisdictionsShared ===
                testCompanyJSON.jurisdictionsShared
        );
        assert(
            testCompany.industryCategory === testCompanyJSON.industryCategory
        );
        assert(testCompany.description === testCompanyJSON.description);
        assert(
            specialCharacters.test(testCompany.nameIndexCharacter) &&
                testCompany.nameIndexCharacter.length == 1
        );
    });
    it("Company: compareNames() works", function () {
        assert(testCompany.compareNames(testCompany2) < 0);
    });
});
