import OffFacebookEventsAnalysis from "../../src/model/analyses/ministories/off-facebook-events-analysis";
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

describe("Off-Facebook events analysis from empty account", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        const facebookAccount = new FacebookAccount();
        ({ analysis, status } = await runAnalysisForAccount(
            OffFacebookEventsAnalysis,
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

describe("Off-Facebook events analysis from account with data", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        let facebookAccount = new FacebookAccount();
        facebookAccount.offFacebookCompanies = [
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
        ({ analysis, status } = await runAnalysisForAccount(
            OffFacebookEventsAnalysis,
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
        expect(analysis._companiesCount).toBe(1);
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
            OffFacebookEventsAnalysis,
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
