import MessagesAnalysis from "../../src/model/analyses/ministories/messages-analysis";
import MessagesMinistory from "../../src/views/ministories/messages";
import {
    DATASET_EXPECTED_VALUES,
    zipFileWithMessageThreads,
} from "../datasets/messages-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { runAnalysisForExport } from "../utils/analyses-execution";
import {
    expectActiveAnalysis,
    expectAnalysisSuccessStatus,
    expectInactiveAnalysis,
} from "../utils/analysis-assertions";

describe("Messages analysis for empty export", () => {
    let analysisStory = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        const { facebookAccount, analysisResult } = await runAnalysisForExport(
            MessagesAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisStory = new MessagesMinistory(facebookAccount);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is not active", async () => {
        expectInactiveAnalysis(analysisStory);
    });
});

describe("Messages analysis for export with messages", () => {
    let analysisStory = null;
    let status = null;
    let analysisData = null;

    beforeAll(async () => {
        let zipFile = zipFileWithMessageThreads();
        const { facebookAccount, analysisResult } = await runAnalysisForExport(
            MessagesAnalysis,
            zipFile
        );
        ({ status } = analysisResult);
        analysisStory = new MessagesMinistory(facebookAccount);
        analysisData = getAnalysisData(analysisStory);
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysisStory);
    });

    it("has correct number of message threads", () =>
        expect(analysisData.messagesThreadsData.length).toBe(
            DATASET_EXPECTED_VALUES.numberOfMessageThreads
        ));

    it("has correct number of message", () =>
        expect(analysisData.messagesCount).toBe(
            DATASET_EXPECTED_VALUES.numberOfMessages
        ));

    it("has correct number of usernames", () =>
        expect(analysisData.totalUsernamesCount).toBe(
            DATASET_EXPECTED_VALUES.numberOfUsernames
        ));

    it("has correct data for thread one", () =>
        expect(analysisData.messagesThreadsData[0]).toStrictEqual({
            title: "Duffy Duck",
            count: 4,
            extraData: {
                firstChatDate: new Date(1462029860538),
                lastChatDate: new Date(1464365061323),
            },
        }));

    it("has correct data for thread two", () =>
        expect(analysisData.messagesThreadsData[1]).toStrictEqual({
            title: "Jane Doe",
            count: 3,
            extraData: {
                firstChatDate: new Date(1562331878036),
                lastChatDate: new Date(1564365061323),
            },
        }));
});

function getAnalysisData(analysisStory) {
    const analysisData = {};
    Object.entries(analysisStory.analyses).forEach(
        ([key, value]) => (analysisData[key] = value)
    );

    return analysisData;
}
