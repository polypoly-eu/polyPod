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

const industryCategoryNames = {};

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

const extractValue = (company, field) =>
    ({
        industryCategory: (company) => {
            const category = company.industryCategory;
            const id = category?.id;
            if (!id) return "?";
            if (!(id in industryCategoryNames))
                industryCategoryNames[id] = category.name;
            return id;
        },
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

export function extractFilters(companies, i18n, globalData) {
    const filters = emptyFilters();
    for (let company of companies)
        for (let field of fields(filters))
            filters[field].add(extractValue(company, field));
    return getSortedArrays(filters, i18n, globalData);
}

export function displayString(field, value, i18n, globalData) {
    const displayStrings = {
        industryCategory: (value) =>
            industryCategoryNames[value]?.[i18n.language] ||
            i18n.t("common:category.undisclosed"),
        jurisdiction: (value) => {
            const key =
                {
                    "EU-GDPR": "euGdpr",
                    Russia: "russia",
                    "Five-Eyes": "fiveEyes",
                    China: "china",
                }[value] || "undisclosed";
            return i18n.t(`common:jurisdiction.${key}`);
        },
        revenueRange: (value) => {
            if (value === "-1") return i18n.t("common:companyFilter.missing");
            const key = allRevenueRanges.find(
                (item) => item === parseInt(value, 10)
            );
            return i18n.t(`common:companyFilter.revenueRange.${key}`);
        },
        location: (value) =>
            (globalData.countries[value] || {})[
                i18n.t("common:companyFilter.countryNameKey")
            ],
    };
    return displayStrings[field](value) || value;
}

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

function getSortedArrays(allFilters, i18n, globalData) {
    const processField = {
        industryCategory: (filters) => {
            return [...filters].sort((a, b) =>
                (
                    industryCategoryNames[a]?.[i18n.language] ||
                    i18n.t("common:category.undisclosed")
                ).localeCompare(
                    industryCategoryNames[b]?.[i18n.language] ||
                        i18n.t("common:category.undisclosed")
                )
            );
        },
        jurisdiction: (filters) => {
            const keys = {
                "EU-GDPR": "euGdpr",
                Russia: "russia",
                "Five-Eyes": "fiveEyes",
                China: "china",
            }; //[value] || "undisclosed";
            return [...filters].sort((a, b) =>
                i18n
                    .t(`common:jurisdiction.${keys[a] || "undisclosed"}`)
                    .localeCompare(
                        i18n.t(
                            `common:jurisdiction.${keys[b] || "undisclosed"}`
                        )
                    )
            );
        },
        location: (filters) => {
            filters.delete(false);
            return [...filters].sort((a, b) =>
                (
                    (globalData.countries[a] || {})[
                        i18n.t("common:companyFilter.countryNameKey")
                    ] || "zz"
                ).localeCompare(
                    (globalData.countries[b] || {})[
                        i18n.t("common:companyFilter.countryNameKey")
                    ] || "zz"
                )
            );
        },
        revenueRange: (filters) => {
            return [...filters];
        },
    };

    for (let field in allFilters) {
        allFilters[field] = processField[field](allFilters[field]);
    }
    return allFilters;
}
