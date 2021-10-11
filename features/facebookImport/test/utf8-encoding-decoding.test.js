"use strict";

import { jsonStringifyWithUtfEscape } from "../src/model/importers/utils/json-encoding";

const jsonData1 = "🦊";
const jsonData2 = "🦊🤗😍";
const jsonData3 = "üåă";
const decodedData1 = '"\\u00f0\\u009f\\u00a6\\u008a"';
const decodedData2 =
    '"\\u00f0\\u009f\\u00a6\\u008a\\u00f0\\u009f\\u00a4\\u0097\\u00f0\\u009f\\u0098\\u008d"';
const decodedData3 = '"\\u00c3\\u00bc\\u00c3\\u00a5\\u00c4\\u0083"';

describe("JSON encode", () => {
    it("Encodes single emoji", () => {
        expect(jsonStringifyWithUtfEscape(jsonData1)).toBe(decodedData1);
    });

    it("Encodes multiple emojis", () => {
        expect(jsonStringifyWithUtfEscape(jsonData2)).toBe(decodedData2);
    });

    it("Various characters", () => {
        expect(jsonStringifyWithUtfEscape(jsonData3)).toBe(decodedData3);
    });
});

describe("Decodes", () => {
    it("With single emoji", () => {
        const parsedJson = JSON.parse(decodedData1);
        expect(decodeURIComponent(escape(parsedJson))).toBe(jsonData1);
    });

    it("With multiple emojis", () => {
        const parsedJson = JSON.parse(decodedData2);
        expect(decodeURIComponent(escape(parsedJson))).toBe(jsonData2);
    });

    it("With various character", () => {
        const parsedJson = JSON.parse(decodedData3);
        expect(decodeURIComponent(escape(parsedJson))).toBe(jsonData3);
    });
});
