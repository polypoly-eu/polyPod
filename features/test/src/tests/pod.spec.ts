import { Pod } from "@polypoly-eu/api";

import { assert } from "../assert";

describe("pod", function () {
    it("resolves", async function () {
        const pod: Pod = window.pod;
        assert.isDefined(pod);
    });
});
