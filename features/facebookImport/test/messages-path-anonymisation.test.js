"use strict";

import { anonymizeJsonEntityPath } from "../src/importer/importer-util";

test("anonymize archived thread message", () => {
    const fileName =
        "facebook-username/messages/archived_threads/johndoes_sk3rnqkbmg/message_1.json";
    const expectedAnonymized =
        "messages/archived_threads/uniqueid_hash/message_1.json";
    expect(anonymizeJsonEntityPath(fileName)).toBe(expectedAnonymized);
});

test("anonymize filtered thread message", () => {
    const fileName =
        "facebook-username/messages/filtered_threads/johndoes_sk3rnqkbmg/message_1.json";
    const expectedAnonymized =
        "messages/filtered_threads/uniqueid_hash/message_1.json";
    expect(anonymizeJsonEntityPath(fileName)).toBe(expectedAnonymized);
});

test("anonymize inbox message", () => {
    const fileName =
        "facebook-username/messages/inbox/johndoes_sk3rnqkbmg/message_1.json";
    const expectedAnonymized = "messages/inbox/uniqueid_hash/message_1.json";
    expect(anonymizeJsonEntityPath(fileName)).toBe(expectedAnonymized);
});

test("anonymize message requests message", () => {
    const fileName =
        "facebook-username/messages/message_requests/johndoes_sk3rnqkbmg/message_1.json";
    const expectedAnonymized =
        "messages/message_requests/uniqueid_hash/message_1.json";
    expect(anonymizeJsonEntityPath(fileName)).toBe(expectedAnonymized);
});

test("anonymize legacy threads message", () => {
    const fileName =
        "facebook-username/messages/legacy_threads/johndoes_sk3rnqkbmg/message_1.json";
    const expectedAnonymized =
        "messages/legacy_threads/uniqueid_hash/message_1.json";
    expect(anonymizeJsonEntityPath(fileName)).toBe(expectedAnonymized);
});

test("anonymize second messages file", () => {
    const fileName =
        "facebook-username/messages/inbox/johndoes_sk3rnqkbmg/message_2.json";
    const expectedAnonymized = "messages/inbox/uniqueid_hash/message_2.json";
    expect(anonymizeJsonEntityPath(fileName)).toBe(expectedAnonymized);
});

test("anonymize facebook user", () => {
    const fileName =
        "facebook-username/messages/inbox/facebookuser_ez_qn7ak-w/message_1.json";
    const expectedAnonymized = "messages/inbox/uniqueid_hash/message_1.json";
    expect(anonymizeJsonEntityPath(fileName)).toBe(expectedAnonymized);
});

test("anonymize with missing name message", () => {
    const fileName =
        "facebook-username/messages/inbox/jhdgfylq-w/message_1.json";
    const expectedAnonymized = "messages/inbox/uniqueid_hash/message_1.json";
    expect(anonymizeJsonEntityPath(fileName)).toBe(expectedAnonymized);
});

test("anonymize unknown message folder", () => {
    const fileName =
        "facebook-username/messages/unknown_messages/johndoes_sk3rnqkbmg/message_1.json";
    const expectedAnonymized =
        "messages/unknown_messages/uniqueid_hash/message_1.json";
    expect(anonymizeJsonEntityPath(fileName)).toBe(expectedAnonymized);
});
