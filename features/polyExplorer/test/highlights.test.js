"use strict";

import assert from "assert";
import { companiesJSON } from "./testCompanyData.js";
import highlights from "../src/data/highlights.js";

const companyPPIDs = companiesJSON.map((c) => c.ppid);

describe("Checks company names", function () {
    it("Uses correct company names", function () {
        Object.keys(highlights).map((hl) => {
            if (companyPPIDs.includes(hl)) {
                assert.ok(companyPPIDs.includes(hl));
            } else {
                console.warn(`⚠️ ${hl} is not a valid PPID`);
            }
            const hlData = highlights[hl];
            if ("dataRecipient" in hlData) {
                if (companyPPIDs.includes(hlData.dataRecipient.name)) {
                    assert.ok(companyPPIDs.includes(hlData.dataRecipient.name));
                } else {
                    console.warn(
                        `⚠️ ${hlData.dataRecipient.name} for ${hl} is not a valid PPID`
                    );
                }
            } else {
                console.warn(
                    `⚠️ ${hl} does not include a «dataRecipient» field`
                );
            }
        });
    });
});
