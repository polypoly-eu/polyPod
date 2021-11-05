import MessagesAnalysis from "../../src/model/analyses/ministories/messages-analysis";
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
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = new ZipFileMock();
        ({ analysis, status } = await runAnalysisForExport(
            MessagesAnalysis,
            zipFile
        ));
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is not active", async () => {
        expectInactiveAnalysis(analysis);
    });
});

describe("Messages analysis for export with messages", () => {
    let analysis = null;
    let status = null;

    beforeAll(async () => {
        let zipFile = zipFileWithMessageThreads();
        ({ analysis, status } = await runAnalysisForExport(
            MessagesAnalysis,
            zipFile
        ));
    });

    it("has success status", async () => {
        expectAnalysisSuccessStatus(status);
    });

    it("is active", async () => {
        expectActiveAnalysis(analysis);
    });

    it("has correct number of message threads", () =>
        expect(analysis._messagesThreadsData.length).toBe(
            DATASET_EXPECTED_VALUES.numberOfMessageThreads
        ));

    it("has correct number of message", () =>
        expect(analysis._messagesCount).toBe(
            DATASET_EXPECTED_VALUES.numberOfMessages
        ));

    it("has correct number of usernames", () =>
        expect(analysis._totalUsernamesCount).toBe(
            DATASET_EXPECTED_VALUES.numberOfUsernames
        ));

    it("has correct data for thread one", () =>
        expect(analysis._messagesThreadsData[0]).toStrictEqual({
            title: "Duffy Duck",
            count: 4,
            extraData: {
                firstChatDate: new Date(1462029860538),
                lastChatDate: new Date(1464365061323),
            },
        }));

    it("has correct data for thread two", () =>
        expect(analysis._messagesThreadsData[1]).toStrictEqual({
            title: "Jane Doe",
            count: 3,
            extraData: {
                firstChatDate: new Date(1562331878036),
                lastChatDate: new Date(1564365061323),
            },
        }));
});
