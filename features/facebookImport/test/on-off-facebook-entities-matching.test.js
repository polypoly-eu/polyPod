import { linkRelatedAccountsWithOffFacebookCompanies } from "../src/model/analyses/utils/on-off-events-matching";
import OffFacebookEventsImporter from "../src/model/importers/off-facebook-events-importer";
import RecentlyViewedAdsImporter from "../src/model/importers/recently-viewed-ads-importer";
import { toUnixTimestamp } from "../src/model/importers/utils/timestamps";
import { zipFileWithOnOffFacebookCompanyMatches } from "./datasets/on-off-events-comparison-data";
import { runMultipleImporters } from "./utils/data-importing";
import { expectAllResultsSuccess } from "./utils/importer-assertions";

describe("Matching on and off facebook event data", () => {
    let zipFile = null;
    let results = null;
    let facebookAccount = null;
    let matchedCompanies = null;

    beforeAll(async () => {
        zipFile = zipFileWithOnOffFacebookCompanyMatches();

        const importingResult = await runMultipleImporters(
            [OffFacebookEventsImporter, RecentlyViewedAdsImporter],
            zipFile
        );
        results = importingResult.results;
        facebookAccount = importingResult.facebookAccount;
        matchedCompanies =
            linkRelatedAccountsWithOffFacebookCompanies(facebookAccount);
    });

    it("imports all data correctly", () => expectAllResultsSuccess(results));

    it("has correct number of related accounts", () =>
        expect(facebookAccount.relatedAccountsCount).toBe(6));

    it("has correct number of advertiser accounts", () =>
        expect(facebookAccount.relatedAccounts.advertisers().length).toBe(6));

    it("has correct number of off-Facebook companies", () =>
        expect(facebookAccount.offFacebookCompaniesCount).toBe(7));

    it("has four on-off Facebook matches", () =>
        expect(matchedCompanies.length).toBe(5));

    it("has correct matched company names", () =>
        expect(matchedCompanies.map((each) => each.displayName)).toStrictEqual([
            "Company A",
            "Company B",
            "Company C1",
            "Company D",
            "Company E",
        ]));

    it("has correct number of companies in full summary", () =>
        expect(
            matchedCompanies
                .map(
                    (consolidatedAdvertiser) =>
                        consolidatedAdvertiser.fullSummary
                )
                .filter(
                    (summary) =>
                        summary.onFacebookTimestamps.length > 0 &&
                        summary.offFacebookTimestamps.length > 0
                ).length
        ).toBe(5));

    it("has correct number of companies in last 90 days summary", () =>
        expect(
            matchedCompanies
                .map((consolidatedAdvertiser) =>
                    consolidatedAdvertiser.last90DaysSummary(
                        toUnixTimestamp("30 August 2021 16:55:00 GMT+00:00")
                    )
                )
                .filter(
                    (summary) =>
                        summary.onFacebookTimestamps.length > 0 &&
                        summary.offFacebookTimestamps.length > 0
                ).length
        ).toBe(4));

    it("has correct latest off-facebook event timestamp", () =>
        expect(facebookAccount.offFacebookEventsLatestTimestamp).toBe(
            toUnixTimestamp("29 August 2021 16:55:00 GMT+00:00")
        ));

    it("has correct latest ad-view event timestamp", () =>
        expect(facebookAccount.relatedAccountEventLatestTimestamp).toBe(
            toUnixTimestamp("29 August 2021 16:50:00 GMT+00:00")
        ));
});
