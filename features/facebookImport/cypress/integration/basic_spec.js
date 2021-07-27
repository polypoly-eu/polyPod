import "../../dist/pod";
import commonStructure from "../../src/static/commonStructure";

describe("Simple tests", () => {
    it("finds window.pod", () => {
        expect(window.pod).to.not.be.null;
    });
    it("imports structure JSON", () => {
        expect(commonStructure).to.not.be.null;
        ["events", "location", "posts", "profile_information"].forEach(
            (key) => {
                expect(Object.keys(commonStructure)).to.include(key);
            }
        );
    });
});
