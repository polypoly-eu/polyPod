"use strict";

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

// TODO: Keeping global state for this isn't nice, maybe we can look these up
// from globalData, or otherwise at least cache them on the CompanyFilter
// instance.
const industryCategoryNames = new Map();

const fields = {
    industryCategory: {
        extractValue(company) {
            const category = company.industryCategory;
            const id = category?.id;
            if (!id) return "?";
            if (!industryCategoryNames.has(id))
                industryCategoryNames.set(id, category.name);
            return id;
        },
        displayString: (value, i18n) =>
            industryCategoryNames.get(value)?.[i18n.language] ||
            i18n.t("common:category.undisclosed"),
        sortedValues(values, i18n, globalData) {
            return [...values].sort((a, b) => {
                const [aString, bString] = [a, b].map((value) =>
                    fields.industryCategory.displayString(
                        value,
                        i18n,
                        globalData
                    )
                );
                return aString.localeCompare(bString);
            });
        },
    },
    jurisdiction: {
        extractValue: (company) => company.jurisdiction,
        displayString(value, i18n) {
            const key =
                {
                    "EU-GDPR": "euGdpr",
                    Russia: "russia",
                    "Five-Eyes": "fiveEyes",
                    China: "china",
                }[value] || "undisclosed";
            return i18n.t(`common:jurisdiction.${key}`);
        },
        sortedValues(values, i18n) {
            return [...values].sort((a, b) => {
                const [aString, bString] = [a, b].map((value) =>
                    fields.jurisdiction.displayString(value, i18n)
                );
                return aString.localeCompare(bString);
            });
        },
    },
    revenueRange: {
        extractValue(company) {
            const revenue = mostRecentAnnualRevenue(company);
            if (revenue === -1) return "-1";
            const reversedRanges = allRevenueRanges.sort((a, b) => b - a);
            for (let step of reversedRanges)
                if (revenue > step) return `${step}`;
            return "0";
        },
        displayString(value, i18n) {
            if (value === "-1") return i18n.t("common:companyFilter.missing");
            const key = allRevenueRanges.find(
                (item) => item === parseInt(value, 10)
            );
            return i18n.t(`common:companyFilter.revenueRange.${key}`);
        },
        sortedValues: (values) => [...values].sort((a, b) => a - b),
    },
    location: {
        extractValue: (company) => company.location.countryCode,
        displayString(value, i18n, globalData) {
            return (globalData.countries[value] || {})[
                i18n.t("common:companyFilter.countryNameKey")
            ];
        },
        sortedValues(values, i18n, globalData) {
            // TODO: There's one company with a countryCode of `false` in the
            // data - should be filtered elsewhere.
            values.delete(false);
            return [...values].sort((a, b) => {
                const [aString, bString] = [a, b].map(
                    (value) =>
                        fields.location.displayString(
                            value,
                            i18n,
                            globalData
                        ) || "zz"
                );
                return aString.localeCompare(bString);
            });
        },
    },
};

export class CompanyFilter {
    static displayString(field, value, i18n, globalData) {
        return fields[field].displayString(value, i18n, globalData) || value;
    }

    constructor(companies = []) {
        this._filters = new Map();
        for (let field of Object.keys(fields))
            this._filters.set(field, new Set());
        for (let company of companies)
            for (let field of this.fields)
                this.add(field, fields[field].extractValue(company));
    }

    add(field, value) {
        if (!this._filters.has(field)) this._filters.set(field, new Set());
        this._filters.get(field).add(value);
    }

    remove(field, value) {
        this._filters.get(field)?.delete(value);
    }

    has(field, value) {
        return this._filters.get(field)?.has(value);
    }

    get empty() {
        return [...this._filters.values()].every((values) => !values.size);
    }

    get fields() {
        return [...this._filters.keys()];
    }

    values(field) {
        return [...this._filters.get(field)];
    }

    matches(company) {
        return [...this._filters.entries()].every(
            ([field, values]) =>
                !values.size || values.has(fields[field].extractValue(company))
        );
    }

    apply(companies) {
        return companies.filter((company) => this.matches(company));
    }

    copy() {
        const copy = new CompanyFilter();
        for (let field of this.fields)
            for (let value of this.values(field)) copy.add(field, value);
        return copy;
    }

    equal(other) {
        if (!(other instanceof CompanyFilter)) return false;
        if (this.fields.length !== other.fields.length) return false;
        return this.fields.every((field) => {
            if (!other.fields.includes(field)) return false;
            const values = this.values(field);
            const otherValues = other.values(field);
            if (values.length !== otherValues.length) return false;
            return values.every((value) => otherValues.includes(value));
        });
    }

    sortedMap(i18n, globalData) {
        return Object.fromEntries(
            [...this._filters.entries()].map(([field, values]) => [
                field,
                fields[field].sortedValues(values, i18n, globalData),
            ])
        );
    }
}
