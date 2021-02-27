"use strict";

export const emptyFilters = () => ({
    industryCategory: new Set(),
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

const allRevenueRanges = [
    -1,
    0,
    100,
    500,
    1000,
    5000,
    20000,
    50000,
    100000,
    1000000,
];

const displayStrings = (i18n, globalData) => ({
    industryCategory: {
        "?": i18n.t("common:companyFilter.missing"),
    },
    revenueRange: Object.fromEntries(
        allRevenueRanges.map((range) => [
            range,
            range === "-1"
                ? i18n.t("common:companyFilter.missing")
                : i18n.t(`common:companyFilter.revenueRange.${range}`),
        ])
    ),
    location: Object.fromEntries(
        Object.entries(globalData.countries || {}).map(([code, data]) => [
            code,
            data[i18n.t("common:companyFilter.countryNameKey")],
        ])
    ),
});

const extractValue = (company, field) =>
    ({
        industryCategory: () => company.industryCategory || "?",
        jurisdiction: (company) => company.jurisdiction,
        location: (company) => company.location.countryCode,
        revenueRange: (company) => {
            const revenue = mostRecentAnnualRevenue(company);
            if (revenue === -1) return "-1";
            const reversedRanges = allRevenueRanges.sort((a, b) => b - a);
            for (let step of reversedRanges)
                if (revenue > step) return `${step}`;
            return "0";
        },
    }[field](company));

export function extractFilters(companies) {
    const filters = emptyFilters();
    for (let company of companies)
        for (let field of fields(filters))
            filters[field].add(extractValue(company, field));
    return filters;
}

export const displayString = (field, value, i18n, globalData) =>
    (displayStrings(i18n, globalData)[field] || [])[value] || value;

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

export function copy(filters) {
    const copiedFilters = emptyFilters();
    for (let field of fields(filters))
        for (let value of values(filters, field))
            addFilter(copiedFilters, field, value);
    return copiedFilters;
}

export function equal(filtersA, filtersB) {
    const fieldsA = fields(filtersA);
    const fieldsB = fields(filtersB);
    if (fieldsA.length !== fieldsB.length) return false;
    return fieldsA.every((field) => {
        if (!fieldsB.includes(field)) return false;
        const valuesA = values(filtersA, field);
        const valuesB = values(filtersB, field);
        if (valuesA.length !== valuesB.length) return false;
        return valuesA.every((value) => valuesB.includes(value));
    });
}
