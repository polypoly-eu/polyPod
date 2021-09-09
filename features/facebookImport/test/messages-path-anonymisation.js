"use strict";

import assert from "assert";
import { anonymizeJsonEntityPath } from "../src/importer/importer-util";

describe("company", function () {
    it("anonymize archived thread message", function () {
        const fileName =
            "facebook-username/messages/archived_threads/johndoes_sk3rnqkbmg/message_1.json";
        const expectedAnonymized =
            "messages/archived_threads/uniqueid_hash/message_1.json";
        assert.strictEqual(
            anonymizeJsonEntityPath(fileName),
            expectedAnonymized
        );
    });

    it("anonymize filtered thread message", function () {
        const fileName =
            "facebook-username/messages/filtered_threads/johndoes_sk3rnqkbmg/message_1.json";
        const expectedAnonymized =
            "messages/filtered_threads/uniqueid_hash/message_1.json";
        assert.strictEqual(
            anonymizeJsonEntityPath(fileName),
            expectedAnonymized
        );
    });

    it("anonymize inbox message", function () {
        const fileName =
            "facebook-username/messages/inbox/johndoes_sk3rnqkbmg/message_1.json";
        const expectedAnonymized =
            "messages/inbox/uniqueid_hash/message_1.json";
        assert.strictEqual(
            anonymizeJsonEntityPath(fileName),
            expectedAnonymized
        );
    });

    it("anonymize second messages file", function () {
        const fileName =
            "facebook-username/messages/inbox/johndoes_sk3rnqkbmg/message_2.json";
        const expectedAnonymized =
            "messages/inbox/uniqueid_hash/message_2.json";
        assert.strictEqual(
            anonymizeJsonEntityPath(fileName),
            expectedAnonymized
        );
    });

    it("anonymize facebook user", function () {
        const fileName =
            "facebook-username/messages/inbox/facebookuser_ez_qn7ak-w/message_1.json";
        const expectedAnonymized =
            "messages/inbox/uniqueid_hash/message_1.json";
        assert.strictEqual(
            anonymizeJsonEntityPath(fileName),
            expectedAnonymized
        );
    });

    it("anonymize with missing name message", function () {
        const fileName =
            "facebook-username/messages/inbox/jhdgfylq-w/message_1.json";
        const expectedAnonymized =
            "messages/inbox/uniqueid_hash/message_1.json";
        assert.strictEqual(
            anonymizeJsonEntityPath(fileName),
            expectedAnonymized
        );
    });
});
