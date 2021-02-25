"use strict";

import i18n from "./i18n.js";

export const emptyFilters = () => ({
    jurisdiction: new Set(),
    location: new Set(),
    revenueRange: new Set(),
});

function mostRecentYearlyProfit(company) {
    const profitPerYearEntries = (company.yearlyProfits || []).map(
        ({ year, profits }) => [year, profits]
    );
    if (!profitPerYearEntries.length) return -1;
    const profitPerYear = Object.fromEntries(profitPerYearEntries);
    const mostRecentYear = Math.max(...Object.keys(profitPerYear));
    return profitPerYear[mostRecentYear].reduce((a, b) => a + b, 0);
}

const displayStrings = {
    revenueRange: {
        "-1": i18n.t("common:companyFilter.missing"),
        0: "&euro; 0 - 100k",
        100: "&euro; 100k - 500k",
        500: "&euro; 500k - 1M",
        1000: "&euro; 1M - 5M",
        5000: "&euro; 5M - 20M",
        20000: "&euro; 20M - 50M",
        50000: "&euro; 50M - 100M",
        100000: "&euro; 100M - 1B",
        1000000: "&euro; 1B &ge;",
    },
    location: {
        DE: "Germany",
        NE: "Netherlands",
    },
};

const extractValue = (company, field) =>
    ({
        jurisdiction: (company) => company.jurisdiction,
        location: (company) => company.location.countryCode,
        revenueRange: (company) => {
            // Reading profits here and calling it revenue - but that's all we
            // have right now.
            const revenue = mostRecentYearlyProfit(company);
            if (revenue === -1) return "-1";
            const allRanges = Object.keys(displayStrings.revenueRange);
            const reversedRanges = allRanges.sort((a, b) => b - a);
            for (let step of reversedRanges) if (revenue > step) return step;
            return 0;
        },
    }[field](company));

export function extractFilters(companies) {
    const filters = emptyFilters();
    for (let company of companies)
        for (let field of fields(filters))
            filters[field].add(extractValue(company, field));
    return filters;
}

export const displayString = (field, value) =>
    (displayStrings[field] || [])[value] || value;

export const hasFilter = (filters, field, value) => filters[field].has(value);

export const addFilter = (filters, field, value) => filters[field].add(value);

export const removeFilter = (filters, field, value) =>
    filters[field].delete(value);

export const fields = (filters) => Object.keys(filters);

export const values = (filters, field) => [...filters[field]];

const matches = (filters, company) =>
    fields(filters).every(
        (field) =>
            !filters[field].size ||
            filters[field].has(extractValue(company, field))
    );

export const applyFilters = (filters, companies) =>
    companies.filter((company) => matches(filters, company));
