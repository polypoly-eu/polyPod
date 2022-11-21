"use strict";

import RecentlyViewedAdsImporter, {
    RECENTLY_VIEWED_FILE_PATH,
} from "../../src/model/importers/recently-viewed-ads-importer";
import {
    creatAdViewsWithCompanyWithUnicodeCharactersData,
    createEnglishDatasetWithEmptyAdsCategory,
    createEnglishDatasetWithMissingAdsCategory,
    createIncompleteEnglishAdViewsData,
} from "../datasets/ad-views-data";
import { ZipFileMock } from "@polypoly-eu/poly-import";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
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
        const { report } = await runRecentlyViewedAdsImporter(zipFile);

        expectMissingFileError(report, RecentlyViewedAdsImporter);
    });
});

describe("Import ad views from export with wrong data key", () => {
    let zipFile = null;
    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(RECENTLY_VIEWED_FILE_PATH);
    });

    it("triggers missing data key error", async () => {
        const { report } = await runRecentlyViewedAdsImporter(zipFile);
        expectInvalidContentError(report, RecentlyViewedAdsImporter);
    });
});

describe("Import ad views from export with missing ads category", () => {
    let report = null;
    let relatedAccounts = null;

    beforeAll(async () => {
        ({ report, relatedAccounts } = await runAdsImportForDataset(
            createEnglishDatasetWithMissingAdsCategory()
        ));
    });

    it("returns warning status", () =>
        expectImportWarning(
            report,
            "Could not locate ads category",
            RecentlyViewedAdsImporter
        ));

    it("has zero related accounts", () =>
        expect(relatedAccounts.count).toBe(0));
});

describe("Import ad views from export with empty ads category", () => {
    let report = null;
    let relatedAccounts = null;

    beforeAll(async () => {
        const response = await runAdsImportForDataset(
            createEnglishDatasetWithEmptyAdsCategory()
        );
        report = response.report;
        relatedAccounts = response.relatedAccounts;
    });

    it("returns success status", () => expectImportSuccess(report));

    it("has zero related accounts", () =>
        expect(relatedAccounts.count).toBe(0));
});

describe("Import ad view with company name with multi-byte unicode characters", () => {
    let report = null;
    let relatedAccounts = null;
    let relatedAccount = null;

    beforeAll(async () => {
        ({ report, relatedAccounts } = await runAdsImportForDataset(
            creatAdViewsWithCompanyWithUnicodeCharactersData()
        ));
        relatedAccount = relatedAccounts.items[0];
    });

    it("returns success status", () => expectImportSuccess(report));

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
    let report = null;
    let relatedAccounts = null;

    beforeAll(async () => {
        ({ report, relatedAccounts } = await runAdsImportForDataset(
            createIncompleteEnglishAdViewsData()
        ));
    });

    it("returns success status", () => expectImportSuccess(report));

    it("has zero related accounts", () =>
        expect(relatedAccounts.count).toBe(1));

    it("has one ad", () => expect(relatedAccounts.adsCount).toBe(1));

    it("has one ad view", () => expect(relatedAccounts.adViewsCount).toBe(1));

    it("has ad with one view", () =>
        expect(
            relatedAccounts.items[0].relatedPosts[0].viewedTimestamps
        ).toStrictEqual([1631975618]));
});
