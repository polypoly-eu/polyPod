import { rollup } from "rollup";
import plugin from "../dist/rollup-plugin-poly-markdown";
import sourceMap from "source-map-support";
import { expect } from "chai";

sourceMap.install();
process.chdir(__dirname);

describe("rollup-plugin-poly-markdown integration test", () => {
    it("should transform the md text in html text", (done) => {
        const expected = `<h1 id=\\"this-is-a-test-of-markdown\\">This is a test of markdown</h1>\\n<poly-test>This is a test of custom tag</poly-test>`;
        rollup({
            input: "sample/main.js",
            plugins: [plugin()],
        })
            .then((bundle) => bundle.generate({}))
            .then((generated) => {
                const text = generated.output[0].code;
                expect(text.indexOf(expected) > -1).to.be.true;
                done();
            });
    });
});
