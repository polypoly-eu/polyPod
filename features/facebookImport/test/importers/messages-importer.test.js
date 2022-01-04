"use strict";

import MessagesImporter from "../../src/model/importers/messages-importer.js";
import {
    MissingContentImportException,
    MissingFilesException,
} from "../../src/model/importers/utils/failed-import-exception.js";
import {
    DATASET_EXPECTED_VALUES,
    zipFileWithMessageThreads,
    zipFileWithThreeFileErrors,
} from "../datasets/messages-data.js";
import { ZipFileMock } from "../mocks/zipfile-mock.js";
import { runMessagesImporter } from "../utils/data-importing.js";
import {
    expectError,
    expectErrorStatus,
    expectImportSuccess,
} from "../utils/importer-assertions.js";

// describe("Import messages from empty export", () => {
//     let zipFile = null;
//     beforeAll(() => {
//         zipFile = new ZipFileMock();
//     });

//     it("triggers missing files error", async () => {
//         const { result } = await runMessagesImporter(zipFile);
//         expectError(result, MissingFilesException, MessagesImporter);
//     });
// });

describe("Import message from export with three file errors", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithThreeFileErrors();
        ({ result, facebookAccount } = await runMessagesImporter(zipFile));
    });

    it("has two error status", async () => {
        expect(result.status.length).toBe(3);
    });

    it("triggers syntax error", async () => {
        expectErrorStatus(result.status[0], MissingContentImportException);
        expectErrorStatus(result.status[1], SyntaxError);
        expectErrorStatus(result.status[2], TypeError);
    });

    it("has no imported messages", () => {
        expect(facebookAccount.messageThreadsCount).toBe(0);
        expect(facebookAccount.messagesCount).toBe(0);
    });
});

describe("Import inbox messages", () => {
    let zipFile = null;
    let result = null;
    let facebookAccount = null;
    let firstMessageThread = null;
    let secondMessageThread = null;

    beforeAll(async () => {
        zipFile = zipFileWithMessageThreads();

        const importingResult = await runMessagesImporter(zipFile);
        result = importingResult.result;
        facebookAccount = importingResult.facebookAccount;
        [firstMessageThread, secondMessageThread] =
            facebookAccount?.messageThreadsGroup?.messagesThreads;
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has correct number of message threads", () =>
        expect(facebookAccount.messageThreadsCount).toBe(
            DATASET_EXPECTED_VALUES.numberOfMessageThreads
        ));

    it("has correct number of message", () =>
        expect(facebookAccount.messagesCount).toBe(
            DATASET_EXPECTED_VALUES.numberOfMessages
        ));

    it("has correct message threads title", () => {
        expect(firstMessageThread.title).toBe("Duffy Duck");
        expect(secondMessageThread.title).toBe("Jane Doe");
    });

    it("has correct message threads participants", () => {
        expect(firstMessageThread.participants).toStrictEqual([
            "Duffy Duck",
            "John Doe",
        ]);
        expect(secondMessageThread.participants).toStrictEqual([
            "Jane Doe",
            "John Doe",
        ]);
    });

    it("has correct message count in threads", () => {
        expect(firstMessageThread.messagesCount).toBe(4);
        expect(secondMessageThread.messagesCount).toBe(3);
    });

    it("has correct word count in threads", () => {
        expect(firstMessageThread.totalWordCount).toBe(8);
        expect(secondMessageThread.totalWordCount).toBe(7);
    });

    it("has correct calls count in threads", () => {
        expect(firstMessageThread.callsCount).toBe(0);
        expect(secondMessageThread.callsCount).toBe(1);
    });

    it("has correct calls duration in threads", () => {
        expect(firstMessageThread.callsDuration).toBe(0);
        expect(secondMessageThread.callsDuration).toBe(2877);
    });

    it("has correct message types in threads", () => {
        expect(firstMessageThread.messageTypes).toStrictEqual(["Generic"]);
        expect(secondMessageThread.messageTypes).toStrictEqual([
            "Generic",
            "Call",
        ]);
    });

    it("has correct message timestamps in threads", () => {
        expect(firstMessageThread.messageTimestamps).toStrictEqual([
            1464365061323, 1462615596454, 1462031878036, 1462029860538,
        ]);
        expect(secondMessageThread.messageTimestamps).toStrictEqual([
            1564365061323, 1562613246454, 1562331878036,
        ]);
    });
});
