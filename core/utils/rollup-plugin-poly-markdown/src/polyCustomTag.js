export const polyCustomTag = {
    name: "polyCustomTag",
    level: "block",
    start(src) {
        return src.match(/<poly-.*>/)?.index;
    },
    tokenizer(src) {
        const rule = /^<poly.*>.*<\/poly.*>$/ms;
        const match = rule.exec(src);
        const firstChar = src.charAt(0);

        if (match && firstChar === "<") {
            return {
                type: "polyCustomTag",
                raw: match[0],
                text: match[0].trim(),
                tokens: this.inlineTokens(match[0].trim()),
            };
        }
    },
    renderer(token) {
        return token.text;
    },
};
