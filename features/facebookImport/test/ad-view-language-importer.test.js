"use strict";

import { RECENTLY_VIEWED_FILE_PATH } from "../src/model/importers/recently-viewed-ads-importer";
import { createEnglishAdViewsData } from "./datasets/ad-views-data";
import { ZipFileMock } from "./mocks/zipfile-mock";
import { runRecentlyViewedAdsImporter } from "./utils/data-importing";
import { expectImportSuccess } from "./utils/importer-assertions";

let testInputs = null;

beforeAll(async () => {
    const datasets = [
        { language: "English", dataset: createEnglishAdViewsData() },
        { language: "English", dataset: createEnglishAdViewsData() },
    ];

    const importingResults = await Promise.all(
        datasets.map(async ({ language, dataset }) => {
            const zipFile = new ZipFileMock();
            zipFile.addJsonEntry(RECENTLY_VIEWED_FILE_PATH, dataset);
            const importingResult = await runRecentlyViewedAdsImporter(zipFile);

            return { language, importingResult };
        })
    );

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

describe("Import ad views", () => {
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
