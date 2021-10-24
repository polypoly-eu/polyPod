"use strict";

import { OFF_FACEBOOK_EVENTS_FILE_PATH } from "../../src/model/importers/off-facebook-events-importer";
import {
    zipFileWithOffFacebookEvents,
    DATASET_EXPECTED_VALUES,
} from "../datasets/off-facebook-events-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
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
        zipFile = zipWithWrongDatasetKey(OFF_FACEBOOK_EVENTS_FILE_PATH);
    });

    it("triggers missing data key error", async () => {
        const { result } = await runOffFacebookEventsImporter(zipFile);
        expectInvalidContentError(result);
    });
});

describe("Import off-facebook events", () => {
    let result = null;
    let facebookAccount = null;
    let offFacebookCompanies = null;
    let companyOne = null;
    let companyTwo = null;

    beforeAll(async () => {
        const zipFile = zipFileWithOffFacebookEvents();
        ({ facebookAccount, result } = await runOffFacebookEventsImporter(
            zipFile
        ));
        offFacebookCompanies = facebookAccount.offFacebookCompanies;
        [companyOne, companyTwo] = offFacebookCompanies;
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has two off-facebook companies", () =>
        expect(facebookAccount.offFacebookCompaniesCount).toBe(
            DATASET_EXPECTED_VALUES.totalCompaniesCount
        ));

    it("has five off-facebook events", () =>
        expect(facebookAccount.offFacebookEventsCount).toBe(
            DATASET_EXPECTED_VALUES.totalEventsCount
        ));

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
