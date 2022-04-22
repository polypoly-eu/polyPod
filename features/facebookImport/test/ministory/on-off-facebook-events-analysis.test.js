import OnOffFacebookEventsAnalysis from "../../src/model/analyses/ministories/on-off-facebook-events-analysis";
import FacebookAccount from "../../src/model/entities/facebook-account";
import {
    runAnalysisForAccount,
    runAnalysisForExport,
} from "../utils/analyses-execution";
import {
    expectActiveAnalysis,
    expectAnalysisSuccessStatus,
    expectInactiveAnalysis,
} from "../utils/analysis-assertions";
import {
    buildDisplayData,
    daysBetween,
    generate90DaysObject,
    selectMeaningfulCompanies,
} from "../../src/model/analyses/utils/on-off-facebook-data-restructuring";
import { toUnixTimestamp } from "../../src/model/importers/utils/timestamps";
import { createMappedOnOffEventsData } from "../datasets/on-off-facebook-events-data";
import { zipFileWithOnOffFacebookCompanyMatches } from "../datasets/on-off-events-comparison-data";
import OnOffFacebookEventsMinistory from "../../src/views/ministories/onOffFacebookEvents";
import analysisKeys from "../../src/model/analyses/utils/analysisKeys";

describe("Off-Facebook events analysis from empty account", () => {
    let status = null;
    let analysisStory = null;
    beforeAll(async () => {
        const facebookAccount = new FacebookAccount();
        ({ status } = await runAnalysisForAccount(
            OnOffFacebookEventsAnalysis,
            facebookAccount
        ));
        analysisStory = new OnOffFacebookEventsMinistory(facebookAccount);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is not active", async () => {
        expectInactiveAnalysis(analysisStory);
    });
});

describe("Off-Facebook events analysis from account with no purchases", () => {
    const expectedCompaniesCount = 1;
    const offFacebookCompanies = [
        {
            name: "CompanyX",
            events: [
                {
                    id: 1234868903343911,
                    type: "PAGE_VIEW",
                    timestamp: 1620541680,
                },
            ],
        },
    ];
    let status = null;
    let analysisStory = null;
    let analysesData = null;
    let analysis = null;

    beforeAll(async () => {
        let facebookAccount = new FacebookAccount();
        facebookAccount.offFacebookCompanies = offFacebookCompanies;
        ({ analysis, status } = await runAnalysisForAccount(
            OnOffFacebookEventsAnalysis,
            facebookAccount
        ));
        analysisStory = new OnOffFacebookEventsMinistory(facebookAccount);
        analysesData = getAnalysisData(facebookAccount, analysis);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysisStory);
    });

    it("has correct companies count", async () => {
        expect(analysesData.companiesCount).toBe(expectedCompaniesCount);
    });

    it("has no companies with ads", async () => {
        expect(analysesData.companiesWithAdsCount).toBe(0);
    });

    it("has variation with no correlations", async () => {
        expect(analysesData.displayType).toBe("off");
    });

    it("has correct report data", async () => {
        expect(analysesData.customReportData).toStrictEqual({
            displayType: "off",
        });
    });
});

describe("Off-Facebook events analysis from export data", () => {
    let status = null;
    let analysisStory = null;
    let analysesData = null;
    let analysis = null;

    beforeAll(async () => {
        const zipFile = zipFileWithOnOffFacebookCompanyMatches();
        const { analysisResult, facebookAccount } = await runAnalysisForExport(
            OnOffFacebookEventsAnalysis,
            zipFile
        );
        ({ analysis, status } = analysisResult);
        analysisStory = new OnOffFacebookEventsMinistory(facebookAccount);
        analysesData = getAnalysisData(facebookAccount, analysis);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysisStory);
    });

    it("has correct companies count", async () => {
        expect(analysesData.companiesCount).toBe(7);
    });

    it("has no companies with ads", async () => {
        expect(analysesData.companiesWithAdsCount).toBe(6);
    });

    it("has variation with on-off correlations", async () => {
        expect(analysesData.displayType).toBe("on-off");
    });

    it("has correct report data", async () => {
        expect(analysesData.customReportData).toStrictEqual({
            displayType: "on-off",
        });
    });
});

describe("On-Off facebook data restructuring", () => {
    const mappedOnOffCompanyTestData = createMappedOnOffEventsData();
    const selectedCompanies = selectMeaningfulCompanies(
        mappedOnOffCompanyTestData
    );
    it("calculates the correct number of days between two timestamps", async () => {
        expect(
            daysBetween(
                toUnixTimestamp("30 August 2021 16:55:00 GMT+00:00"),
                toUnixTimestamp("28 August 2021 16:55:00 GMT+00:00")
            )
        ).toBe(2);
        expect(
            daysBetween(
                toUnixTimestamp("30 August 2021 16:55:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 16:55:00 GMT+00:00")
            )
        ).toBe(0);
    });

    it("creates an empty 90-days object to be filled with on and off facebook event values", async () => {
        const ninetyDaysObj = generate90DaysObject();
        //Last ninety days includes day 0 (today) -> 91
        expect(ninetyDaysObj.length).toBe(91);
        expect(ninetyDaysObj[0]).toStrictEqual({ on: 0, off: 0 });
    });

    it("selects the correct companies", async () => {
        expect(selectedCompanies[0].name).toBe("Schaden LLC");
        expect(selectedCompanies[1].name).toBe("Ova-Cronin");
        expect(selectedCompanies[2].name).toBe("Bailey Murphy and Stokes");
    });

    it("builds the correct display object structure", async () => {
        const displayData = buildDisplayData(
            selectedCompanies,
            toUnixTimestamp("31 August 2021 16:55:00 GMT+00:00")
        );
        expect(displayData["Schaden LLC"].map((e) => e.key)).toStrictEqual(
            Array.from({ length: 91 }, (_, i) => i)
        );
        expect(displayData["Schaden LLC"][1].upper).toBe(7);
        expect(displayData["Schaden LLC"][1].lower).toBe(7);
    });
});

function getAnalysisData(facebookAccount, analysis) {
    return {
        companiesCount: facebookAccount.analyses[analysisKeys.companiesCount],
        companiesWithAdsCount:
            facebookAccount.analyses[analysisKeys.companiesWithAdsCount],
        displayType:
            facebookAccount.analyses[analysisKeys.onOffEvents].displayType,
        customReportData: analysis.customReportData,
    };
}
