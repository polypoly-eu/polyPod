"use strict";

import assert from "assert";
import * as entity from "../src/model/entity.js";
import testEntityJSON from "./testCompanyData.js";
import testGlobalJSON from "./testGlobal.js";

const i18n = {
    language: "en",
};

describe("Entity", function () {
    const specialCharacters = /[!@#$%^&*()_+\-=[\]{};':"\\|<>?]+/;

    function createTestEntity(name) {
        const aTestEntityJSON = { ...testEntityJSON };
        aTestEntityJSON.name = name;
        return new entity.Entity(aTestEntityJSON, testGlobalJSON, i18n);
    }

    const testEntity = new entity.Entity(testEntityJSON, testGlobalJSON, i18n);

    it("ppid is parsed correctly", function () {
        assert.strictEqual(testEntity.ppid, testEntityJSON.ppid);
    });

    it("Name is parsed correctly", function () {
        assert.strictEqual(testEntity.name, testEntityJSON.name);
    });

    it("Featured tag is parsed correctly", function () {
        assert.strictEqual(testEntity.featured, testEntityJSON.featured);
    });

    it("DataRecipients is parsed correctly", function () {
        assert.strictEqual(
            testEntity.dataRecipients,
            testEntityJSON.dataRecipients
        );
    });

    //this test doesn't work here anymore since the original datastructure is willingly changed
    //grateful for input on how to make a test here that makes sense
    /*
    it("DatasharingPurposes is parsed correctly", function () {
        assert.strictEqual(
            testEntity.dataSharingPurposes,
            testEntityJSON.dataSharingPurposes
        );
    });

    it("DataTypesShared is parsed correctly", function () {
        assert.strictEqual(
            testEntity.dataTypesShared,
            testEntityJSON.dataTypesShared
        );
    });
    */

    it("JurisdictionsShared is parsed correctly", function () {
        assert.strictEqual(
            testEntity.jurisdictionsShared,
            testEntityJSON.jurisdictionsShared
        );
    });

    it("Description is parsed correctly", function () {
        assert.strictEqual(testEntity.description, testEntityJSON.description);
    });

    it("NameIndexCharacter only gives one character", function () {
        assert.strictEqual(testEntity.nameIndexCharacter.length, 1);
    });

    it("NameIndexCharacter has no special characters", function () {
        assert(!specialCharacters.test(testEntity.nameIndexCharacter));
    });

    const stringPatterns = ["%$%AAA", "!%$&ABC", "T", "()zz", "[]ZZZ"];

    for (let i = 0; i < stringPatterns.length - 1; i++) {
        it("CompareNames() works", function () {
            assert(
                createTestEntity(stringPatterns[i]).compareNames(
                    createTestEntity(stringPatterns[i + 1])
                ) < 0
            );
        });
    }
});
