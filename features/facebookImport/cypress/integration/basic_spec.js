import "../../dist/pod";

describe("Simple test", () => {
    it("finds window.pod", () => {
        expect(window.pod).to.not.be.null;
    });
});
