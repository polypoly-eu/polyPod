"use strict";

import { jsonStringifyWithUtfEscape } from "../src/importer/json-encoding";

const jsonData1 = "🦊";
const jsonData2 = "🦊🤗😍";

test("JSON encode single emoji", () => {
    expect(jsonStringifyWithUtfEscape(jsonData1)).toBe(
        '"\\u00f0\\u009f\\u00a6\\u008a"'
    );
});

test("JSON encode multiple emojis", () => {
    expect(jsonStringifyWithUtfEscape(jsonData2)).toBe(
        '"\\u00f0\\u009f\\u00a6\\u008a\\u00f0\\u009f\\u00a4\\u0097\\u00f0\\u009f\\u0098\\u008d"'
    );
});

test("Decode single emoji", () => {
    const parsedJson = JSON.parse('"\\u00f0\\u009f\\u00a6\\u008a"');
    expect(decodeURIComponent(escape(parsedJson))).toBe(jsonData1);
});

test("Decode multiple emojis", () => {
    const parsedJson = JSON.parse(
        '"\\u00f0\\u009f\\u00a6\\u008a\\u00f0\\u009f\\u00a4\\u0097\\u00f0\\u009f\\u0098\\u008d"'
    );
    expect(decodeURIComponent(escape(parsedJson))).toBe(jsonData2);
});
