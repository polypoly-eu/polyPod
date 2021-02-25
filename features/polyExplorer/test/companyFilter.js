"use strict";

import assert from "assert";
import * as companyFilter from "../src/companyFilter.js";

describe("companyFilter", function () {
    it("Adding a filter works", function () {
        const field = "jurisdiction";
        const value = "EU-GDPR";
        const filters = companyFilter.emptyFilters();
        const hasTestFilter = () =>
            companyFilter.hasFilter(filters, field, value);
        assert.equal(hasTestFilter(), false);
        companyFilter.addFilter(filters, field, value);
        assert.equal(hasTestFilter(), true);
    });
});
