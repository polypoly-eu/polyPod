"use strict";

import i18n from "./i18n.js";

export const emptyFilters = () => ({
    jurisdiction: new Set(),
    location: new Set(),
    revenueRange: new Set(),
});

function mostRecentAnnualRevenue(company) {
    const annualRevenues = company.annualRevenues || [];
    if (!annualRevenues.length) return -1;
    const lastAnnualRevenue = [...annualRevenues]
        .sort((a, b) => a.year - b.year)
        .pop();
    return lastAnnualRevenue.amount / 1000;
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
        // TODO: Translated country names will be part of the input data soon -
        // hard coded for now.
        DE: "Germany",
        NE: "Netherlands",
    },
};

const extractValue = (company, field) =>
    ({
        jurisdiction: (company) => company.jurisdiction,
        location: (company) => company.location.countryCode,
        revenueRange: (company) => {
            const revenue = mostRecentAnnualRevenue(company);
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

export const values = (filters, field) =>
    [...filters[field]].sort((a, b) =>
        Number.isNaN(a) || Number.isNaN(b) ? a.localeCompare(b) : a - b
    );

const matches = (filters, company) =>
    fields(filters).every(
        (field) =>
            !filters[field].size ||
            filters[field].has(extractValue(company, field))
    );

export const applyFilters = (filters, companies) =>
    companies.filter((company) => matches(filters, company));

export const empty = (filters) =>
    !Object.values(filters).some((values) => values.size);
