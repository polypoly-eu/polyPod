import ConnectedAdvertisersAnalysis from "../../src/model/analyses/ministories/connected-advertisers-analysis";
import FacebookAccount from "../../src/model/entities/facebook-account";
import ConnectedAdvertisersMinistory from "../../src/views/ministories/connectedAdvertisers";
import {
    DATASET_EXPECTED_VALUES as CONNECTED_ADVERTISERS_DATASET_V2_EXTENDED,
    zipFileWithConnectedAdvertisersAllTypes,
} from "../datasets/connected-advertisers-all-types-data";
import {
    DATASET_EXPECTED_VALUES as CONNECTED_ADVERTISERS_DATASET_V2_BASIC,
    zipFileWithConnectedAdvertisers,
} from "../datasets/connected-advertisers-data";
import {
    runAnalysisForAccount,
    runAnalysisForExport,
} from "../utils/analyses-execution";
import {
    expectActiveAnalysis,
    expectAnalysisSuccessStatus,
    expectInactiveAnalysis,
} from "../utils/analysis-assertions";

describe("Connected advertisers analysis from account with no connected advertisers", () => {
    let analysisStory = null;
    let status = null;

    beforeAll(async () => {
        const facebookAccount = new FacebookAccount();
        ({ status } = await runAnalysisForAccount(
            ConnectedAdvertisersAnalysis,
            facebookAccount
        ));
        analysisStory = new ConnectedAdvertisersMinistory({
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

describe("Connected advertisers analysis from account with connected advertisers - v2 simple format", () => {
    let analysisStory = null;
    let analysisData = null;
    let status = null;

    beforeAll(async () => {
        const zipFile = zipFileWithConnectedAdvertisers();
        const { facebookAccount, analysisResult } = await runAnalysisForExport(
            ConnectedAdvertisersAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisStory = new ConnectedAdvertisersMinistory({
            account: facebookAccount,
        });
        analysisData = {
            connectedAdvertisersCount: analysisStory.analysisData.length,
        };
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysisStory);
    });

    it("has correct count", async () => {
        expect(analysisData.connectedAdvertisersCount).toBe(
            CONNECTED_ADVERTISERS_DATASET_V2_BASIC.numberOfConnectedAdvertisers
        );
    });
});

describe("Connected advertisers analysis from account with connected advertisers - v2 extended format", () => {
    let analysisStory = null;
    let analysisData = null;
    let status = null;

    beforeAll(async () => {
        const zipFile = zipFileWithConnectedAdvertisersAllTypes();
        const { facebookAccount, analysisResult } = await runAnalysisForExport(
            ConnectedAdvertisersAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisStory = new ConnectedAdvertisersMinistory({
            account: facebookAccount,
        });
        analysisData = {
            connectedAdvertisersCount: analysisStory.analysisData.length,
        };
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysisStory);
    });

    it("has correct count", async () => {
        expect(analysisData.connectedAdvertisersCount).toBe(
            CONNECTED_ADVERTISERS_DATASET_V2_EXTENDED.numberOfConnectedAdvertisers
        );
    });
});
