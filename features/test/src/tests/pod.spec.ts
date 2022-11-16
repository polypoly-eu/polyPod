const assert = chai.assert;

describe("pod", function () {
    it("resolves", async function () {
        assert.isDefined(await window.pod);
    });
});
