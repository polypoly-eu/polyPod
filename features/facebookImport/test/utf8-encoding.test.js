"use strict";

import { jsonStringifyWithUtfEscape } from "../src/importer/json-encoding";

test("JSON encode single emoji", () => {
    const jsonData = "🦊";

    expect(jsonStringifyWithUtfEscape(jsonData)).toBe(
        '"\\u00f0\\u009f\\u00a6\\u008a"'
    );
});

test("JSON encode multiple emojis", () => {
    const jsonData = "🦊🤗😍";

    expect(jsonStringifyWithUtfEscape(jsonData)).toBe(
        '"\\u00f0\\u009f\\u00a6\\u008a\\u00f0\\u009f\\u00a4\\u0097\\u00f0\\u009f\\u0098\\u008d"'
    );
});
