import { Info } from "@polypoly-eu/api";

import { assert } from "../assert";

describe("info", function () {
    const info: Info = window.pod.info;

    it("includes runtime and version info", async function () {
        assert.isOk(await info.getRuntime());
        assert.isOk(await info.getVersion());
    });
});
