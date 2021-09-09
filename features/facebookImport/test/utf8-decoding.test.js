"use strict";

test("Decode single emoji", () => {
    const parsedJson = JSON.parse('"\u00f0\u009f\u00a6\u008a"');
    expect(decodeURIComponent(escape(parsedJson))).toBe("🦊");
});

test("Decode multiple emojis", () => {
    const parsedJson = JSON.parse(
        '"\u00f0\u009f\u00a6\u008a\u00f0\u009f\u00a4\u0097\u00f0\u009f\u0098\u008d"'
    );
    expect(decodeURIComponent(escape(parsedJson))).toBe("🦊🤗😍");
});
