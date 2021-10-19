"use strict";

import { MissingMessagesFilesException } from "../../src/model/importers/utils/failed-import-exception.js";
import { ZipFileMock } from "../mocks/zipfile-mock.js";
import { runMessagesImporter } from "../utils/data-importing.js";
import {
    expectError,
    expectImportSuccess,
} from "../utils/importer-assertions.js";

function createMessageThreadOneData() {
    return {
        participants: [{ name: "Duffy Duck" }, { name: "John Doe" }],
        title: "Duffy Duck",
        is_still_participant: true,
        thread_type: "Regular",
        thread_path: "inbox/duffyduck_2jzaxws1kg",
        magic_words: [],
        messages: [
            {
                sender_name: "John Doe",
                timestamp_ms: 1464365061323,
                content: "First message",
                type: "Generic",
                is_unsent: false,
            },

            {
                sender_name: "John Doe",
                timestamp_ms: 1462615596454,
                content: "Second message",
                type: "Generic",
                is_unsent: false,
            },

            {
                sender_name: "John Doe",
                timestamp_ms: 1462031878036,
                content: "Third message",
                type: "Generic",
                is_unsent: false,
            },

            {
                sender_name: "Duffy Duck",
                timestamp_ms: 1462029860538,
                content: "Second message",
                type: "Generic",
                is_unsent: false,
            },
        ],
    };
}

function createMessageThreadTwoData() {
    return {
        participants: [{ name: "Jane Doe" }, { name: "John Doe" }],
        title: "Jane Doe",
        is_still_participant: true,
        thread_type: "Regular",
        thread_path: "inbox/janedoe_h63g35dgdha",
        magic_words: [],
        messages: [
            {
                sender_name: "Jane Doe",
                timestamp_ms: 1564365061323,
                content: "First message",
                type: "Generic",
                is_unsent: false,
            },

            {
                sender_name: "John Doe",
                timestamp_ms: 1562613246454,
                content: "Second message",
                type: "Generic",
                is_unsent: false,
            },

            {
                sender_name: "Jane Doe",
                timestamp_ms: 1562331878036,
                content: "Jane called you.",
                call_duration: 2877,
                type: "Call",
                is_unsent: false,
            },
        ],
    };
}

describe("Import messages from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { result } = await runMessagesImporter(zipFile);

        expectError(result, MissingMessagesFilesException);
    });
});

describe("Import inbox messages", () => {
    let zipFile = null;
    let result = null;
    let facebookAccount = null;
    let firstMessageThread = null;
    let secondMessageThread = null;

    beforeAll(async () => {
        zipFile = new ZipFileMock();
        zipFile.addJsonEntry(
            "messages/inbox/duffyduck_2jzaxws1kg/message_1.json",
            createMessageThreadOneData()
        );
        zipFile.addJsonEntry(
            "messages/inbox/janedoe_h63g35dgdha/message_1.json",
            createMessageThreadTwoData()
        );

        const importingResult = await runMessagesImporter(zipFile);
        result = importingResult.result;
        facebookAccount = importingResult.facebookAccount;
        [firstMessageThread, secondMessageThread] =
            facebookAccount?.messageThreadsGroup?.messagesThreads;
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has two message threads", () =>
        expect(facebookAccount.messageThreadsCount).toBe(2));

    it("has seven message", () =>
        expect(facebookAccount.messagesCount).toBe(7));

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
