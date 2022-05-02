import AdvertisingValueAnalysis from "../../src/model/analyses/ministories/advertising-value-analysis";
import analysisKeys from "../../src/model/analyses/utils/analysisKeys";
import FacebookAccount from "../../src/model/entities/facebook-account";
import AdvertisingValueMinistory from "../../src/views/ministories/advertisingValue";
import { runAnalysisForAccount } from "../utils/analyses-execution";
import {
    expectInactiveAnalysis,
    expectAnalysisSuccessStatus,
    expectActiveAnalysis,
} from "../utils/analysis-assertions";

describe("Your advertising value analysis from account with no ad interests", () => {
    let status = null;
    let analysisStory = null;

    beforeAll(async () => {
        const facebookAccount = new FacebookAccount();
        ({ status } = await runAnalysisForAccount(
            AdvertisingValueAnalysis,
            facebookAccount
        ));
        analysisStory = new AdvertisingValueMinistory({
            account: facebookAccount,
        });
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is not active", async () => {
        expectInactiveAnalysis(analysisStory);
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
        let status = null;
        let analysisStory = null;
        let analysisData = null;

        beforeAll(async () => {
            let facebookAccount = new FacebookAccount();
            facebookAccount.adInterests = dataset.adInterests;
            ({ status } = await runAnalysisForAccount(
                AdvertisingValueAnalysis,
                facebookAccount
            ));
            analysisStory = new AdvertisingValueMinistory({
                account: facebookAccount,
            });
            analysisData = {
                numberInterests:
                    analysisStory.analyses[analysisKeys.numberInterests],
                randomAdInterests:
                    analysisStory.analyses[analysisKeys.randomAdInterests],
            };
        });

        it("has success status", async () => {
            expectAnalysisSuccessStatus(status);
        });

        it("is active", async () => {
            expectActiveAnalysis(analysisStory);
        });

        it("has correct number of ad interests", async () => {
            expect(analysisData.numberInterests).toBe(
                dataset.adInterests.length
            );
        });

        it("has correct number of random interests", async () => {
            expect(analysisData.randomAdInterests.length).toBe(
                dataset.randomAdInterestsCount
            );
        });

        it("includes all random interests", async () => {
            analysisData.randomAdInterests.forEach((adInterest) =>
                expect(dataset.adInterests).toContain(adInterest)
            );
        });
    });
}
