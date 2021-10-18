"use strict";

import { RECENTLY_VIEWED_FILE_PATH } from "../../src/model/importers/recently-viewed-ads-importer";
import {
    creatAdViewsWithCompanyWithUnicodeCharactersData,
    createEnglishDatasetWithEmptyAdsCategory,
    createEnglishDatasetWithMissingAdsCategory,
    createIncompleteEnglishAdViewsData,
} from "../datasets/ad-views-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import {
    runAdsImportForDataset,
    runRecentlyViewedAdsImporter,
} from "../utils/data-importing";
import {
    expectImportSuccess,
    expectImportWarning,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

describe("Import ad views from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { result } = await runRecentlyViewedAdsImporter(zipFile);

        expectMissingFileError(result);
    });
});

describe("Import ad views from export with wrong data key", () => {
    let zipFile = null;

    beforeAll(async () => {
        zipFile = new ZipFileMock();
        zipFile.addJsonEntry(RECENTLY_VIEWED_FILE_PATH, {
            recently_viewed_wrong: [],
        });
    });

    it("triggers missing data key error", async () => {
        const { result } = await runRecentlyViewedAdsImporter(zipFile);
        expectInvalidContentError(result);
    });
});

describe("Import ad views from export with missing ads category", () => {
    let result = null;
    let relatedAccounts = null;

    beforeAll(async () => {
        const importingResult = await runAdsImportForDataset(
            createEnglishDatasetWithMissingAdsCategory()
        );
        result = importingResult.result;
        relatedAccounts = importingResult.relatedAccounts;
    });

    it("returns warning status", () =>
        expectImportWarning(result, "Could not locate ads category"));

    it("has zero related accounts", () =>
        expect(relatedAccounts.count).toBe(0));
});

describe("Import ad views from export with empty ads category", () => {
    let result = null;
    let relatedAccounts = null;

    beforeAll(async () => {
        const importingResult = await runAdsImportForDataset(
            createEnglishDatasetWithEmptyAdsCategory()
        );
        result = importingResult.result;
        relatedAccounts = importingResult.relatedAccounts;
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has zero related accounts", () =>
        expect(relatedAccounts.count).toBe(0));
});

describe("Import ad view with company name with multi-byte unicode characters", () => {
    let result = null;
    let relatedAccounts = null;
    let relatedAccount = null;

    beforeAll(async () => {
        const importingResult = await runAdsImportForDataset(
            creatAdViewsWithCompanyWithUnicodeCharactersData()
        );
        result = importingResult.result;
        relatedAccounts = importingResult.relatedAccounts;
        relatedAccount = relatedAccounts.items[0];
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has one related account", () => expect(relatedAccounts.count).toBe(1));

    it("has one ad", () => expect(relatedAccounts.adsCount).toBe(1));

    it("has one ad view", () => expect(relatedAccounts.adViewsCount).toBe(1));

    it("has correct related account ids", () => {
        expect(relatedAccount.rawId).toBeUndefined();
        expect(relatedAccount.urlId).toBe("ü🦊å");
    });

    it("has correct related account display name", () => {
        expect(relatedAccount.displayName).toBe("å🦊ü");
    });
});

describe("Import incomplete ad views from export", () => {
    let result = null;
    let relatedAccounts = null;

    beforeAll(async () => {
        const importingResult = await runAdsImportForDataset(
            createIncompleteEnglishAdViewsData()
        );
        result = importingResult.result;
        relatedAccounts = importingResult.relatedAccounts;
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has zero related accounts", () =>
        expect(relatedAccounts.count).toBe(1));

    it("has one ad", () => expect(relatedAccounts.adsCount).toBe(1));

    it("has one ad view", () => expect(relatedAccounts.adViewsCount).toBe(1));

    it("has ad with one view", () =>
        expect(
            relatedAccounts.items[0].relatedPosts[0].viewedTimestamps
        ).toStrictEqual([1631975618]));
});
