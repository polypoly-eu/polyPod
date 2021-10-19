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

describe("Import ad views", () => {
    test.each(datasets)("from %s dataset", async (language, dataset) => {
        const importingResult = await runAdsImportForDataset(dataset);
        const result = importingResult.result;
        const relatedAccounts = importingResult.relatedAccounts;
        const [firstRelatedAccount, secondRelatedAccount] =
            relatedAccounts.items;

        //returns success status
        expectImportSuccess(result);

        //has two related accounts
        expect(relatedAccounts.count).toBe(2);

        // has three ads
        expect(relatedAccounts.adsCount).toBe(3);

        //has four ad views
        expect(relatedAccounts.adViewsCount).toBe(4);

        //has correct related account ids for first account
        expect(firstRelatedAccount.rawId).toBeUndefined();
        expect(firstRelatedAccount.urlId).toBe("companyx.com");

        //has correct related account ids for second account
        expect(secondRelatedAccount.rawId).toBe("99888776543223");
        expect(secondRelatedAccount.urlId).toBeUndefined();

        //has correct related accourl URLs
        expect(firstRelatedAccount.url).toBe(
            "https://www.facebook.com/companyx.com"
        );
        expect(secondRelatedAccount.url).toBe(
            "https://www.facebook.com/99888776543223"
        );

        //has correct related account names
        expect(firstRelatedAccount.displayName).toBe("Company X");
        expect(secondRelatedAccount.displayName).toBe("Company Y");

        //has correct ads count in accounts
        expect(firstRelatedAccount.adsCount).toBe(2);
        expect(secondRelatedAccount.adsCount).toBe(1);

        //has correct ad views count in accounts
        expect(firstRelatedAccount.adViewsCount).toBe(3);
        expect(secondRelatedAccount.adViewsCount).toBe(1);

        //has correct url for ads
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

        //has correct viewed timestamps for ads
        expect(firstAd.viewedTimestamps).toStrictEqual([
            1630875618, 1631975618,
        ]);
        expect(secondAd.viewedTimestamps).toStrictEqual([1671975618]);
        expect(thirdAd.viewedTimestamps).toStrictEqual([1693455618]);

        //has correct view counts for ads
        expect(firstAd.viewsCount).toBe(2);
        expect(secondAd.viewsCount).toBe(1);
        expect(thirdAd.viewsCount).toBe(1);
    });
});

/*
let testInputs = null;

beforeAll(() => {
    const datasets = [
        { language: "English", dataset: createEnglishAdViewsData() },
        { language: "German", dataset: createGermanAdViewsData() },
    ];

    return Promise.all(
        datasets.map(async ({ language, dataset }) => {
            const zipFile = new ZipFileMock();
            zipFile.addJsonEntry(RECENTLY_VIEWED_FILE_PATH, dataset);
            const importingResult = await runRecentlyViewedAdsImporter(zipFile);

            return { language, importingResult };
        })
    ).then((importingResults) => {
        testInputs = importingResults.map(({ language, importingResult }) => {
            const result = importingResult.result;
            const facebookAccount = importingResult.facebookAccount;
            const relatedAccounts = facebookAccount.relatedAccounts;
            const [firstRelatedAccount, secondRelatedAccount] =
                relatedAccounts.items;
            return [
                language,
                [
                    result,
                    facebookAccount,
                    relatedAccounts,
                    firstRelatedAccount,
                    secondRelatedAccount,
                ],
            ];
        });
    });
});

describe("Import ad views", () => {
    console.log(testInputs);
    test.each(testInputs)(
        "returns success status for %s dataset.",
        (language, result) => {
            expectImportSuccess(result);
        }
    );

    test.each(testInputs)(
        "has two related accounts for %s dataset.",
        (language, { relatedAccounts }) => {
            expect(relatedAccounts.count).toBe(2);
        }
    );

    test.each(testInputs)(
        "has three ads for %s dataset.",
        (language, { relatedAccounts }) => {
            expect(relatedAccounts.adsCount).toBe(3);
        }
    );
});
*/
