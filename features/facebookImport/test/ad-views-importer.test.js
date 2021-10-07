"use strict";

import { ZipFileMock } from "./mocks/zipfile-mock";
import { runRecentlyViewedAdsImporter } from "./utils/data-importing";
import {
    expectImportSuccess,
    expectMissingFileError,
} from "./utils/importer-assertions";

function wrapViewsData(data) {
    return { recently_viewed: data };
}

function createEnglishAdViewsData() {
    return wrapViewsData([
        {
            name: "Facebook Watch Videos and Shows",
            description:
                "Videos and shows you've recently visited or viewed from Facebook Watch and time you've spent watching shows",
            children: [],
        },
        {
            name: "Posts that have been shown to you in your News Feed",
            description:
                "Posts that have been shown to you in your News Feed in the last 90 days.",
            entries: [],
        },
        {
            name: "Ads",
            description: "Ads you've recently viewed",
            entries: [
                {
                    timestamp: 1630875618,
                    data: {
                        name: "Ad by Company X",
                        uri: "https://www.facebook.com/companyx.com/posts/1112223344556677",
                    },
                },
                {
                    timestamp: 1631975618,
                    data: {
                        name: "Ad by Company X",
                        uri: "https://www.facebook.com/companyx.com/posts/1112223344556677",
                    },
                },
                {
                    timestamp: 1671975618,
                    data: {
                        name: "Ad by Company X",
                        uri: "https://www.facebook.com/companyx.com/posts/2233445566678",
                    },
                },
                {
                    timestamp: 1693455618,
                    data: {
                        name: "Ad by Company Y",
                        uri: "https://www.facebook.com/permalink.php?story_fbid=12345678889&id=99888776543223",
                    },
                },
            ],
        },
    ]);
}

function createGermanAdViewsData() {
    return wrapViewsData([
        {
            name: "Videos und Shows auf Facebook Watch",
            description:
                "Videos und Shows, die du dir k\u00c3\u00bcrzlich auf Facebook Watch angesehen hast, und die Zeit, die du mit dem Ansehen verbracht hast.",
            children: [],
        },
        {
            name: "Beitr\u00c3\u00a4ge, die dir im News Feed angezeigt wurden",
            description:
                "Beitr\u00c3\u00a4ge, die dir in den letzten 90 Tagen in deinem News Feed angezeigt wurden.",
            entries: [],
        },
        {
            name: "Werbeanzeigen",
            description:
                "Werbeanzeigen, die du dir k\u00c3\u00bcrzlich angesehen hast",
            entries: [
                {
                    timestamp: 1630875618,
                    data: {
                        name: "Werbeanzeige von Company X",
                        uri: "https://www.facebook.com/companyx.com/posts/1112223344556677",
                    },
                },
            ],
        },
    ]);
}

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

describe("Import ad views from English dataset", () => {
    let zipFile = null;
    let result = null;
    let facebookAccount = null;
    let relatedAccounts = null;
    let firstRelatedAccount = null;
    let secondRelatedAccount = null;

    beforeAll(async () => {
        zipFile = new ZipFileMock();
        zipFile.addJsonEntry(
            "your_interactions_on_facebook/recently_viewed.json",
            createEnglishAdViewsData()
        );

        const importingResult = await runRecentlyViewedAdsImporter(zipFile);
        result = importingResult.result;
        facebookAccount = importingResult.facebookAccount;
        relatedAccounts = facebookAccount.relatedAccounts;
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
    let zipFile = null;
    let result = null;
    let facebookAccount = null;
    let relatedAccounts = null;
    let relatedAccount = null;

    beforeAll(async () => {
        zipFile = new ZipFileMock();
        zipFile.addJsonEntry(
            "your_interactions_on_facebook/recently_viewed.json",
            createGermanAdViewsData()
        );

        const importingResult = await runRecentlyViewedAdsImporter(zipFile);
        result = importingResult.result;
        facebookAccount = importingResult.facebookAccount;
        relatedAccounts = facebookAccount.relatedAccounts;
        [relatedAccount] = relatedAccounts.items;
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has one related accounts", () => expect(relatedAccounts.count).toBe(1));

    it("has one ad", () => expect(relatedAccounts.adsCount).toBe(1));

    it("has one ad view", () => expect(relatedAccounts.adViewsCount).toBe(1));

    it("has correct related account id", () => {
        expect(relatedAccount.urlId).toBe("companyx.com");
    });

    it("has correct related accourl URL", () => {
        expect(relatedAccount.url).toBe(
            "https://www.facebook.com/companyx.com"
        );
    });

    it("has correct related account names", () => {
        expect(relatedAccount.displayName).toBe("Company X");
    });

    it("has correct ad count in account", () => {
        expect(relatedAccount.adsCount).toBe(1);
    });

    it("has correct ad views count in account", () => {
        expect(relatedAccount.adViewsCount).toBe(1);
    });
});
