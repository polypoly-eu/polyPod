function jsonStringEscapeUtfCharacters(jsonString) {
    return jsonString.replace(/[\u007f-\uffff]/g, function (c) {
        return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
    });
}

/**
 * Take a object and convert it to a JSON string by:
 * - encoding multi-byte Unicode string into utf-8 multiple single-byte characters
 *   (BMP / basic multilingual plane only). Chars in range U+0080 - U+07FF are encoded
 *    in 2 chars, U+0800 - U+FFFF in 3 chars.
 * - replace unicode characters larger than \u007f with their escape sequence.
 *
 * In JSON we can encode a character directly or using its escape sequence:
 *  - "A"
 *  - "\u0041"
 *
 * In the Facebook export we get multiple encoded single-byte characters.
 */
function jsonStringifyWithUtfEscape(jsonData) {
    const serializedString = JSON.stringify(jsonData, (key, value) => {
        if (typeof value === "string") {
            return unescape(encodeURIComponent(value));
        }
        return value;
    });
    const escapedString = jsonStringEscapeUtfCharacters(serializedString);
    return escapedString;
}

export { jsonStringEscapeUtfCharacters, jsonStringifyWithUtfEscape };
