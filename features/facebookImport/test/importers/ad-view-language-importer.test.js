"use strict";

import {
    createDanishAdViewsData,
    createEnglishAdViewsData,
    createGermanAdViewsData,
} from "../datasets/ad-views-data";
import { runAdsImportForDataset } from "../utils/data-importing";
import { expectImportSuccess } from "../utils/importer-assertions";

const datasets = [
    ["English", createEnglishAdViewsData()],
    ["German", createGermanAdViewsData()],
    ["Danish", createDanishAdViewsData()],
];

datasets.forEach(([language, dataset]) =>
    describe(`Import ad views from ${language} dataset`, () => {
        let result = null;
        let relatedAccounts = null;
        let firstRelatedAccount = null;
        let secondRelatedAccount = null;

        beforeAll(async () => {
            const importingResult = await runAdsImportForDataset(dataset);
            result = importingResult.result;
            relatedAccounts = importingResult.relatedAccounts;
            [firstRelatedAccount, secondRelatedAccount] = relatedAccounts.items;
        });

        it("returns success status", () => expectImportSuccess(result));

        it("has two related accounts", () =>
            expect(relatedAccounts.count).toBe(2));

        it("has three ads", () => expect(relatedAccounts.adsCount).toBe(3));

        it("has four ad views", () =>
            expect(relatedAccounts.adViewsCount).toBe(4));

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
    })
);
