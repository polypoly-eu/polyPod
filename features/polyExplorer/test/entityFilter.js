"use strict";

import assert from "assert";
import { I18n } from "@polypoly-eu/silly-i18n";
import { EntityFilter } from "../src/model/entityFilter.js";

describe("entityFilter", function () {
    const companyData = [
        {
            name: "genericDeCompany",
            jurisdiction: "EU-GDPR",
            location: { countryCode: "DE" },
            annualRevenues: [
                {
                    year: 2019,
                    date: "31.12.2019",
                    amount: 501000,
                },
            ],
        },
        {
            name: "genericNlCompany",
            jurisdiction: "EU-GDPR",
            location: { countryCode: "NL" },
            annualRevenues: [
                {
                    year: 2018,
                    date: "31.12.2018",
                    amount: 1001000,
                },
                {
                    year: 2019,
                    date: "31.3.2019",
                    amount: 101000,
                },
            ],
        },
    ];

    const companyByName = (name) =>
        companyData.find((data) => data.name === name);

    function assertHas(entityFilter, field, value) {
        assert.ok(
            entityFilter.has(field, value),
            `Filter ${field} = ${value} not present`
        );
    }

    function assertHasNot(entityFilter, field, value) {
        assert.ok(
            !entityFilter.has(field, value),
            `Filter ${field} = ${value} present`
        );
    }

    beforeEach(function () {
        this.filter = new EntityFilter();
    });

    it("Adding a filter works", function () {
        const field = "jurisdiction";
        const value = "EU-GDPR";
        assertHasNot(this.filter, field, value);
        this.filter.add(field, value);
        assertHas(this.filter, field, value);
    });

    it("Removing a filter works", function () {
        const field = "jurisdiction";
        const value = "EU-GDPR";
        this.filter.add(field, value);
        this.filter.remove(field, value);
        assertHasNot(this.filter, field, value);
    });

    it("Display string for revenue range is correct", function () {
        const i18n = new I18n("en", {
            en: {
                common: {
                    "entityFilter.revenueRange.500": "&euro; 500k - 1M",
                },
            },
        });
        const display = this.filter.displayString(
            "revenueRange",
            500,
            i18n,
            {}
        );
        assert.equal(display, "&euro; 500k - 1M");
    });

    it("Reading fields and values works", function () {
        this.filter.add("jurisdiction", "EU-GDPR");
        this.filter.add("location", "DE");
        const fields = this.filter.fields;
        assert.ok(
            ["jurisdiction", "location"].every((field) =>
                fields.includes(field)
            ),
            `${fields} does not include jurisdiction and location`
        );
        assert.deepEqual(this.filter.values("jurisdiction"), ["EU-GDPR"]);
        assert.deepEqual(this.filter.values("location"), ["DE"]);
    });

    it("Extracting filters from company data works", function () {
        const expectedFilters = [
            ["jurisdiction", "EU-GDPR"],
            ["location", "DE"],
            ["location", "NL"],
            ["revenueRange", "100"],
            ["revenueRange", "500"],
        ];
        this.filter = new EntityFilter(companyData);
        for (let [field, value] of expectedFilters)
            assertHas(this.filter, field, value);
    });

    it("Applying no filters returns all", function () {
        const filtered = this.filter.apply(companyData);
        assert.deepEqual(filtered, companyData);
    });

    it("Applying two filters for one field matches either", function () {
        this.filter.add("location", "DE");
        this.filter.add("location", "NL");
        const filtered = this.filter.apply(companyData);
        assert.deepEqual(filtered, companyData);
    });

    it("Applying two filters for different fields matches both", function () {
        this.filter.add("jurisdiction", "EU-GDPR");
        this.filter.add("location", "NL");
        const filtered = this.filter.apply(companyData);
        assert.equal(filtered.length, 1);
        assert.deepEqual(filtered[0], companyByName("genericNlCompany"));
    });

    it("Unknown revenue is extracted correctly", function () {
        const emptyCompanyData = [{ location: { countryCode: "" } }];
        this.filter = new EntityFilter(emptyCompanyData);
        assertHas(this.filter, "revenueRange", "-1");
    });

    it("Unknown revenue is matched correctly", function () {
        const emptyCompanyData = [{ location: { countryCode: "" } }];
        this.filter.add("revenueRange", "-1");
        const filtered = this.filter.apply(emptyCompanyData);
        assert.deepEqual(filtered, emptyCompanyData);
    });

    it("Empty filters are classified correctly", function () {
        assert.ok(this.filter.empty);
        this.filter.add("jurisdiction", "GDPR-EU");
        assert.ok(!this.filter.empty);
    });

    it("Extracting filters does not modify company data", function () {
        const companyDataBackup = JSON.stringify(companyData);
        this.filter = new EntityFilter(companyData);
        assert.equal(JSON.stringify(companyData), companyDataBackup);
    });

    it("Deep copying filters works", function () {
        this.filter.add("jurisdiction", "EU-GDPR");
        const copied = this.filter.copy();
        copied.remove("jurisdiction", "EU-GDPR");
        assertHas(this.filter, "jurisdiction", "EU-GDPR");
    });

    it("Equals works", function () {
        this.filter.add("location", "NL");
        this.filter.add("location", "DE");
        const comparable = new EntityFilter();
        comparable.add("location", "DE");
        assert.ok(!this.filter.equal(comparable));
        comparable.add("location", "NL");
        assert.ok(this.filter.equal(comparable));
    });

    it("Location values are sorted by display string", function () {
        const i18n = new I18n("en", {
            en: {
                common: {
                    "entityFilter.countryNameKey": "translation",
                },
            },
        });
        const globalData = {
            countries: {
                DE: { translation: "Germany" },
                FR: { translation: "France" },
                NL: { translation: "Netherlands" },
            },
        };
        this.filter.add("location", "NL");
        this.filter.add("location", "FR");
        this.filter.add("location", "DE");
        const sorted = this.filter.sortedValues("location", i18n, globalData);
        assert.deepEqual(sorted, ["FR", "DE", "NL"]);
    });

    it("Revenue range values are sorted numerically", function () {
        this.filter.add("revenueRange", "500");
        this.filter.add("revenueRange", "-1");
        this.filter.add("revenueRange", "1000");
        const sorted = this.filter.sortedValues("revenueRange", {}, {});
        assert.deepEqual(sorted, ["-1", "500", "1000"]);
    });
});
