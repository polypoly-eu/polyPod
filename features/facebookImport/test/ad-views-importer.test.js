"use strict";

import { RECENTLY_VIEWED_FILE_PATH } from "../src/model/importers/recently-viewed-ads-importer";
import {
    creatAdViewsWithCompanyWithUnicodeCharactersData,
    createDanishAdViewsData,
    createEnglishAdViewsData,
    createEnglishDatasetWithMissingAdsCategory,
    createGermanAdViewsData,
    createIncompleteEnglishAdViewsData,
} from "./datasets/ad-views-data";
import { ZipFileMock } from "./mocks/zipfile-mock";
import {
    runAdsImportForDataset,
    runRecentlyViewedAdsImporter,
} from "./utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "./utils/importer-assertions";

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

describe("Import ad views from English dataset", () => {
    let result = null;
    let relatedAccounts = null;
    let firstRelatedAccount = null;
    let secondRelatedAccount = null;

    beforeAll(async () => {
        const importingResult = await runAdsImportForDataset(
            createEnglishAdViewsData()
        );
        result = importingResult.result;
        relatedAccounts = importingResult.relatedAccounts;
        [firstRelatedAccount, secondRelatedAccount] = relatedAccounts.items;
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has two related accounts", () => expect(relatedAccounts.count).toBe(2));

    it("has three ads", () => expect(relatedAccounts.adsCount).toBe(3));

    it("has four ad views", () => expect(relatedAccounts.adViewsCount).toBe(4));

    it("has correct related account ids for first account", () => {
        expect(firstRelatedAccount.rawId).toBeUndefined();
        expect(firstRelatedAccount.urlId).toBe("companyx.com");
    });

    it("has correct related account ids for second account", () => {
        expect(secondRelatedAccount.rawId).toBe("99888776543223");
        expect(secondRelatedAccount.urlId).toBeUndefined();
    });

    it("has correct related accourl URLs", () => {
        expect(firstRelatedAccount.url).toBe(
            "https://www.facebook.com/companyx.com"
        );
        expect(secondRelatedAccount.url).toBe(
            "https://www.facebook.com/99888776543223"
        );
    });

    it("has correct related account names", () => {
        expect(firstRelatedAccount.displayName).toBe("Company X");
        expect(secondRelatedAccount.displayName).toBe("Company Y");
    });

    it("has correct ads count in accounts", () => {
        expect(firstRelatedAccount.adsCount).toBe(2);
        expect(secondRelatedAccount.adsCount).toBe(1);
    });

    it("has correct ad views count in accounts", () => {
        expect(firstRelatedAccount.adViewsCount).toBe(3);
        expect(secondRelatedAccount.adViewsCount).toBe(1);
    });

    it("has correct url for ads", () => {
        const [firstAd, secondAd] = firstRelatedAccount.relatedPosts;
        const [thirdAd] = secondRelatedAccount.relatedPosts;
        expect(firstAd.url).toBe(
            "https://www.facebook.com/companyx.com/posts/1112223344556677"
        );
        expect(secondAd.url).toBe(
            "https://www.facebook.com/companyx.com/posts/2233445566678"
        );
        expect(thirdAd.url).toBe(
            "https://www.facebook.com/permalink.php?story_fbid=12345678889&id=99888776543223"
        );
    });

    it("has correct viewed timestamps for ads", () => {
        const [firstAd, secondAd] = firstRelatedAccount.relatedPosts;
        const [thirdAd] = secondRelatedAccount.relatedPosts;
        expect(firstAd.viewedTimestamps).toStrictEqual([
            1630875618, 1631975618,
        ]);
        expect(secondAd.viewedTimestamps).toStrictEqual([1671975618]);
        expect(thirdAd.viewedTimestamps).toStrictEqual([1693455618]);
    });

    it("has correct view counts for ads", () => {
        const [firstAd, secondAd] = firstRelatedAccount.relatedPosts;
        const [thirdAd] = secondRelatedAccount.relatedPosts;
        expect(firstAd.viewsCount).toBe(2);
        expect(secondAd.viewsCount).toBe(1);
        expect(thirdAd.viewsCount).toBe(1);
    });
});

describe("Import ad views from German dataset", () => {
    let result = null;
    let relatedAccounts = null;
    let firstRelatedAccount = null;
    let secondRelatedAccount = null;

    beforeAll(async () => {
        const importingResult = await runAdsImportForDataset(
            createGermanAdViewsData()
        );
        result = importingResult.result;
        relatedAccounts = importingResult.relatedAccounts;
        [firstRelatedAccount, secondRelatedAccount] = relatedAccounts.items;
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has two related accounts", () => expect(relatedAccounts.count).toBe(2));

    it("has three ads", () => expect(relatedAccounts.adsCount).toBe(3));

    it("has four ad views", () => expect(relatedAccounts.adViewsCount).toBe(4));

    it("has correct related account names", () => {
        expect(firstRelatedAccount.displayName).toBe("Company X");
        expect(secondRelatedAccount.displayName).toBe("Company Y");
    });

    it("has correct related account names", () => {
        expect(firstRelatedAccount.displayName).toBe("Company X");
        expect(secondRelatedAccount.displayName).toBe("Company Y");
    });
});

describe("Import ad views from Danish dataset", () => {
    let result = null;
    let relatedAccounts = null;
    let firstRelatedAccount = null;
    let secondRelatedAccount = null;

    beforeAll(async () => {
        const importingResult = await runAdsImportForDataset(
            createDanishAdViewsData()
        );
        result = importingResult.result;
        relatedAccounts = importingResult.relatedAccounts;
        [firstRelatedAccount, secondRelatedAccount] = relatedAccounts.items;
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has two related accounts", () => expect(relatedAccounts.count).toBe(2));

    it("has three ads", () => expect(relatedAccounts.adsCount).toBe(3));

    it("has four ad views", () => expect(relatedAccounts.adViewsCount).toBe(4));

    it("has correct related account names", () => {
        expect(firstRelatedAccount.displayName).toBe("Company X");
        expect(secondRelatedAccount.displayName).toBe("Company Y");
    });

    it("has correct related account names", () => {
        expect(firstRelatedAccount.displayName).toBe("Company X");
        expect(secondRelatedAccount.displayName).toBe("Company Y");
    });
});
