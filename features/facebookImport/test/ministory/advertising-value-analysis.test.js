import AdvertisingValueAnalysis from "../../src/model/analyses/ministories/advertising-value-analysis";
import FacebookAccount from "../../src/model/entities/facebook-account";
import { runAnalysisForAccount } from "../utils/analyses-execution";
import {
    expectInactiveAnalysis,
    expectAnalysisSuccessStatus,
    expectActiveAnalysis,
} from "../utils/analysis-assertions";

describe("Your advertising value analysis from account with no ad interests", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        const facebookAccount = new FacebookAccount();
        ({ analysis, status } = await runAnalysisForAccount(
            AdvertisingValueAnalysis,
            facebookAccount
        ));
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is not active", async () => {
        expectInactiveAnalysis(analysis);
    });
});

const DATASETS = [
    {
        adInterests: ["Interest"],
        randomAdInterestsCount: 1,
    },
    {
        adInterests: ["InterestOne", "InterestTwo"],
        randomAdInterestsCount: 2,
    },
    {
        adInterests: ["InterestOne", "InterestTwo", "InterestThree"],
        randomAdInterestsCount: 3,
    },

    {
        adInterests: [
            "InterestOne",
            "InterestTwo",
            "InterestThree",
            "InterestFour",
        ],
        randomAdInterestsCount: 3,
    },
];
for (const dataset of DATASETS) {
    describe("Your advertising value analysis from account with no ad interests", () => {
        let analysis = null;
        let status = null;

        beforeAll(async () => {
            let facebookAccount = new FacebookAccount();
            facebookAccount.adInterests = dataset.adInterests;
            ({ analysis, status } = await runAnalysisForAccount(
                AdvertisingValueAnalysis,
                facebookAccount
            ));
        });

        it("has success status", async () => {
            expectAnalysisSuccessStatus(status);
        });

        it("is active", async () => {
            expectActiveAnalysis(analysis);
        });

        it("has correct number of ad interests", async () => {
            expect(analysis._numberInterests).toBe(dataset.adInterests.length);
        });

        it("has correct number of random interests", async () => {
            expect(analysis._randomAdInterests.length).toBe(
                dataset.randomAdInterestsCount
            );
        });

        it("includes all random interests", async () => {
            analysis._randomAdInterests.forEach((adInterest) =>
                expect(dataset.adInterests).toContain(adInterest)
            );
        });
    });
}
