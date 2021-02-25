"use strict";

import assert from "assert";
import * as companyFilter from "../src/companyFilter.js";

describe("companyFilter", function () {
    const companyData = [
        {
            name: "genericDeCompany",
            jurisdiction: "EU-GDPR",
            location: { countryCode: "DE" },
            annualRevenue: {
                "31.12.2019": 501000,
            },
        },
        {
            name: "genericNlCompany",
            jurisdiction: "EU-GDPR",
            location: { countryCode: "NL" },
            annualRevenue: {
                "31.12.2018": 1001000,
                "31.3.2019": 101000,
            },
        },
    ];

    const companyByName = (name) =>
        companyData.find((data) => data.name === name);

    function assertHas(filters, field, value) {
        assert.ok(
            companyFilter.hasFilter(filters, field, value),
            `Filter ${field} = ${value} not present`
        );
    }

    function assertHasNot(filters, field, value) {
        assert.ok(
            !companyFilter.hasFilter(filters, field, value),
            `Filter ${field} = ${value} present`
        );
    }

    before(function () {
        this.add = (field, value) =>
            companyFilter.addFilter(this.filters, field, value);
    });

    beforeEach(function () {
        this.filters = companyFilter.emptyFilters();
    });

    it("Adding a filter works", function () {
        const field = "jurisdiction";
        const value = "EU-GDPR";
        assertHasNot(this.filters, field, value);
        this.add(field, value);
        assertHas(this.filters, field, value);
    });

    it("Removing a filter works", function () {
        const field = "jurisdiction";
        const value = "EU-GDPR";
        this.add(field, value);
        companyFilter.removeFilter(this.filters, field, value);
        assertHasNot(this.filters, field, value);
    });

    it("Display string for revenue range is correct", function () {
        const display = companyFilter.displayString("revenueRange", 500);
        assert.equal(display, "&euro; 500k - 1M");
    });

    it("Reading fields and values works", function () {
        this.add("jurisdiction", "EU-GDPR");
        this.add("location", "DE");
        const fields = companyFilter.fields(this.filters);
        assert.ok(
            ["jurisdiction", "location"].every((field) =>
                fields.includes(field)
            )
        );
        assert.deepEqual(companyFilter.values(this.filters, "jurisdiction"), [
            "EU-GDPR",
        ]);
        assert.deepEqual(companyFilter.values(this.filters, "location"), [
            "DE",
        ]);
    });

    it("Values are sorted", function () {
        this.add("location", "DE");
        this.add("location", "NL");
        this.add("revenueRange", "-1");
        this.add("revenueRange", "500");
        this.add("revenueRange", "1000");
        assert.deepEqual(companyFilter.values(this.filters, "location"), [
            "DE",
            "NL",
        ]);
        assert.deepEqual(companyFilter.values(this.filters, "revenueRange"), [
            "-1",
            "500",
            "1000",
        ]);
    });

    it("Extracting filters from company data works", function () {
        const expectedFilters = [
            ["jurisdiction", "EU-GDPR"],
            ["location", "DE"],
            ["location", "NL"],
            ["revenueRange", "100"],
            ["revenueRange", "500"],
        ];
        const extractedFilters = companyFilter.extractFilters(companyData);
        for (let [field, value] of expectedFilters)
            assertHas(extractedFilters, field, value);
    });

    it("Applying no filters returns all", function () {
        const filtered = companyFilter.applyFilters(this.filters, companyData);
        assert.deepEqual(filtered, companyData);
    });

    it("Applying two filters for one field matches either", function () {
        this.add("location", "DE");
        this.add("location", "NL");
        const filtered = companyFilter.applyFilters(this.filters, companyData);
        assert.deepEqual(filtered, companyData);
    });

    it("Applying two filters for different fields matches both", function () {
        this.add("jurisdiction", "EU-GDPR");
        this.add("location", "NL");
        const filtered = companyFilter.applyFilters(this.filters, companyData);
        assert.deepEqual(filtered, [companyByName("genericNlCompany")]);
    });

    it("Unknown revenue is extracted correctly", function () {
        const emptyCompanyData = [{ location: { countryCode: "" } }];
        const extractedFilters = companyFilter.extractFilters(emptyCompanyData);
        assertHas(extractedFilters, "revenueRange", "-1");
    });

    it("Unknown revenue is matched correctly", function () {
        const emptyCompanyData = [{ location: { countryCode: "" } }];
        this.add("revenueRange", "-1");
        const filtered = companyFilter.applyFilters(
            this.filters,
            emptyCompanyData
        );
        assert.deepEqual(filtered, emptyCompanyData);
    });

    it("Empty filters are classified correctly", function () {
        assert.ok(companyFilter.empty(this.filters));
        this.add("jurisdiction", "GDPR-EU");
        assert.ok(!companyFilter.empty(this.filters));
    });
});
