"use strict";

import { OFF_FACEBOOK_EVENTS_FILE_PATH } from "../../src/model/importers/off-facebook-events-importer";
import { createOffFacebookEventsSimpleData } from "../datasets/off-facebook-events-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { runOffFacebookEventsImporter } from "../utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

describe("Import off-facebook events from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { result } = await runOffFacebookEventsImporter(zipFile);

        expectMissingFileError(result);
    });
});

describe("Import off-facebook events from export with wrong data key", () => {
    let zipFile = null;

    beforeAll(async () => {
        zipFile = new ZipFileMock();
        zipFile.addJsonEntry(OFF_FACEBOOK_EVENTS_FILE_PATH, { wrong_key: [] });
    });

    it("triggers missing data key error", async () => {
        const { result } = await runOffFacebookEventsImporter(zipFile);
        expectInvalidContentError(result);
    });
});

describe("Import off-facebook events", () => {
    let zipFile = null;
    let result = null;
    let facebookAccount = null;
    let offFacebookCompanies = null;
    let companyOne = null;
    let companyTwo = null;

    beforeAll(async () => {
        zipFile = new ZipFileMock();
        zipFile.addJsonEntry(
            OFF_FACEBOOK_EVENTS_FILE_PATH,
            createOffFacebookEventsSimpleData()
        );

        const importingResult = await runOffFacebookEventsImporter(zipFile);
        result = importingResult.result;
        facebookAccount = importingResult.facebookAccount;
        offFacebookCompanies = facebookAccount.offFacebookCompanies;
        [companyOne, companyTwo] = offFacebookCompanies;
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has two off-facebook companies", () =>
        expect(facebookAccount.offFacebookCompaniesCount).toBe(2));

    it("has five off-facebook events", () =>
        expect(facebookAccount.offFacebookEventsCount).toBe(5));

    it("has correct names for off-Facebook companies", () => {
        expect(companyOne.name).toBe("companyx.com");
        expect(companyTwo.name).toBe("Company Y");
    });

    it("has correct event count for off-Facebook companies", () => {
        expect(companyOne.events.length).toBe(3);
        expect(companyTwo.events.length).toBe(2);
    });

    it("has correct event timestamps", () => {
        expect(companyOne.events[0].timestamp).toBe(1613919120);
        expect(companyOne.events[1].timestamp).toBe(1623919120);
        expect(companyOne.events[2].timestamp).toBe(1633919120);

        expect(companyTwo.events[0].timestamp).toBe(1613919120);
        expect(companyTwo.events[1].timestamp).toBe(1623919120);
    });
});
