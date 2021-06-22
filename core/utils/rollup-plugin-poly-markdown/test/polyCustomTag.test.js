import { expect } from "chai";

import { polyCustomTag } from "../src/polyCustomTag";

describe("unit test for polyCustomTag", () => {
    it(`Check constants in the transpiller`, () => {
        expect(polyCustomTag.name).to.be.equal("polyCustomTag");
        expect(polyCustomTag.level).to.be.equal("block");
    });

    describe("Unit test for polyCustomTag.start", () => {
        it(`should return undefined if the MD does not contains a "<poly-" tag`, () => {
            const mdText = "# This is a markdown text";
            const result = polyCustomTag.start(mdText);

            expect(result).to.be.undefined;
        });

        it(`should return the position of the "<poly-" tag in the text`, () => {
            const mdText = `
                # This is a markdown text
                
                <poly-example>custom tag example</poly-example>
            `;

            const index = mdText.match(/<poly-.*>/).index;
            const result = polyCustomTag.start(mdText);
            expect(index).to.be.equal(result);
        });
    });

    describe("Unit test for polyCustomTag.tokenizer", () => {
        it(`should return undefined if there are not any "<poly-" tag in the text`, () => {
            const mdText = "# This is a markdown text";
            const result = polyCustomTag.tokenizer(mdText);

            expect(result).to.be.undefined;
        });

        it(`should return undefined if the text block doesn't start with "<"`, () => {
            const mdText = `
                # This is a markdown text
                
                <poly-example>custom tag example</poly-example> 
            `;

            const result = polyCustomTag.tokenizer(mdText);
            expect(result).to.be.undefined;
        });

        it(`
        should return a token object if the text block contains a "<poly-" tag and it is at the beginning of the text
        `, () => {
            const mdText = `<poly-example>custom tag example</poly-example>`;
            const result = polyCustomTag.tokenizer.call(
                {
                    inlineTokens: (text) => {
                        expect(text).to.be.equal(mdText.trim());
                    },
                },
                mdText
            );

            expect(result.type).to.be.equal("polyCustomTag");
            expect(result.raw).to.be.equal(mdText);
            expect(result.text).to.be.equal(mdText.trim());
        });
    });

    describe("Unit test for polyCustomTag.renderer", () => {
        it(`should return the text of the token`, () => {
            const mdText = `<poly-example>custom tag example</poly-example>`;
            const token = {
                type: "polyCustomTag",
                raw: mdText,
                text: mdText.trim(),
            };

            const result = polyCustomTag.renderer(token);
            expect(result).to.be.equal(token.text);
        });
    });
});
