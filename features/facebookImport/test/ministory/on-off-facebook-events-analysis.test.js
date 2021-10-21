import OnOffFacebookEventsAnalysis from "../../src/model/analyses/ministories/on-off-facebook-events-analysis";
import FacebookAccount from "../../src/model/entities/facebook-account";
import {
    DATASET_EXPECTED_VALUES,
    zipFileWithOffFacebookEvents,
} from "../datasets/off-facebook-events-data";
import {
    runAnalysisForAccount,
    runAnalysisForExport,
} from "../utils/analyses-execution";
import {
    expectActiveAnalysis,
    expectAnalysisSuccessStatus,
} from "../utils/analysis-assertions";
import {
    buildDisplayData,
    daysBetween,
    generate90DaysObject,
    selectMeaningfulCompanies,
} from "../../src/model/analyses/utils/on-off-facebook-data-restructuring";
import { toUnixTimestamp } from "../../src/model/importers/utils/timestamps";
import { createMappedOnOffEventsData } from "../datasets/on-off-facebook-events-data";

describe("Off-Facebook events analysis from empty account", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        const facebookAccount = new FacebookAccount();
        ({ analysis, status } = await runAnalysisForAccount(
            OnOffFacebookEventsAnalysis,
            facebookAccount
        ));
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is not active", async () => {
        expect(analysis.active).toBe(false);
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
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        let facebookAccount = new FacebookAccount();
        facebookAccount.offFacebookCompanies = offFacebookCompanies;
        ({ analysis, status } = await runAnalysisForAccount(
            OnOffFacebookEventsAnalysis,
            facebookAccount
        ));
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysis);
    });

    it("has correct companies count", async () => {
        expect(analysis._companiesCount).toBe(expectedCompaniesCount);
    });

    it("has correct purchases Count", async () => {
        expect(analysis._purchasesCount).toBe(0);
    });
});

describe("Off-Facebook events analysis from export data", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        const zipFile = zipFileWithOffFacebookEvents();
        ({ analysis, status } = await runAnalysisForExport(
            OnOffFacebookEventsAnalysis,
            zipFile
        ));
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysis);
    });

    it("has correct companies count", async () => {
        expect(analysis._companiesCount).toBe(
            DATASET_EXPECTED_VALUES.totalCompaniesCount
        );
    });

    it("has correct purchases Count", async () => {
        expect(analysis._purchasesCount).toBe(1);
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
