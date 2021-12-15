import ConnectedAdvertisersAnalysis from "../../src/model/analyses/ministories/connected-advertisers-analysis";
import FacebookAccount from "../../src/model/entities/facebook-account";
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
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        const facebookAccount = new FacebookAccount();
        ({ analysis, status } = await runAnalysisForAccount(
            ConnectedAdvertisersAnalysis,
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

describe("Connected advertisers analysis from account with connected advertisers - v2 simple format", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        const zipFile = zipFileWithConnectedAdvertisers();
        const { analysisResult } = await runAnalysisForExport(
            ConnectedAdvertisersAnalysis,
            zipFile
        );
        ({ analysis, status } = analysisResult);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysis);
    });

    it("has correct count", async () => {
        expect(analysis._connectedAdvertisersCount).toBe(
            CONNECTED_ADVERTISERS_DATASET_V2_BASIC.numberOfConnectedAdvertisers
        );
    });
});

describe("Connected advertisers analysis from account with connected advertisers - v2 extended format", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        const zipFile = zipFileWithConnectedAdvertisersAllTypes();
        const { analysisResult } = await runAnalysisForExport(
            ConnectedAdvertisersAnalysis,
            zipFile
        );
        ({ analysis, status } = analysisResult);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysis);
    });

    it("has correct count", async () => {
        expect(analysis._connectedAdvertisersCount).toBe(
            CONNECTED_ADVERTISERS_DATASET_V2_EXTENDED.numberOfConnectedAdvertisers
        );
    });
});
