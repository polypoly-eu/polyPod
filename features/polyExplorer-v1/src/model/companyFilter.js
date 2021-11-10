"use strict";

class FieldMatcher {
    constructor(companies = []) {
        this._values = new Set(
            Object.values(companies).map((company) =>
                this.constructor.extractValue(company)
            )
        );
    }

    get values() {
        return [...this._values];
    }

    sortedValues(i18n, globalData) {
        return this.values.sort((a, b) => {
            const [aString, bString] = [a, b].map((value) =>
                this.constructor.displayString(value, i18n, globalData)
            );
            return aString.localeCompare(bString);
        });
    }

    add(value) {
        this._values.add(value);
    }

    has(value) {
        return this._values.has(value);
    }

    delete(value) {
        this._values.delete(value);
    }

    get empty() {
        return !this._values.size;
    }

    matches(company) {
        return this.empty || this.has(this.constructor.extractValue(company));
    }
}

// TODO: Keeping global state for this isn't nice, maybe we can look these up
//       from globalData, or otherwise at least cache them on the instance.
const industryCategoryNames = new Map();

class IndustryCategoryMatcher extends FieldMatcher {
    static extractValue(company) {
        const category = company.industryCategory;
        const id = category?.id;
        if (!id) return "?";
        if (!industryCategoryNames.has(id))
            industryCategoryNames.set(id, category.name);
        return id;
    }

    static displayString(value, i18n) {
        return (
            industryCategoryNames.get(value)?.[i18n.language] ||
            i18n.t("common:category.undisclosed")
        );
    }
}

class JurisdictionMatcher extends FieldMatcher {
    static extractValue(company) {
        return company.jurisdiction;
    }

    static displayString(value, i18n) {
        const key =
            {
                "EU-GDPR": "euGdpr",
                Russia: "russia",
                "Five-Eyes": "fiveEyes",
                China: "china",
            }[value] || "undisclosed";
        return i18n.t(`common:jurisdiction.${key}`);
    }
}

const revenueRangeValues = [
    -1, 0, 100, 500, 1000, 5000, 20000, 50000, 100000, 1000000,
];

class RevenueRangeMatcher extends FieldMatcher {
    static _mostRecentAnnualRevenue(company) {
        const annualRevenues = company.annualRevenues || [];
        if (!annualRevenues.length) return -1;
        const lastAnnualRevenue = [...annualRevenues]
            .sort((a, b) => a.year - b.year)
            .pop();
        return lastAnnualRevenue.amount / 1000;
    }

    static extractValue(company) {
        const revenue = this._mostRecentAnnualRevenue(company);
        if (revenue === -1) return "-1";
        const reversedRanges = revenueRangeValues.sort((a, b) => b - a);
        for (let step of reversedRanges) if (revenue > step) return `${step}`;
        return "0";
    }

    static displayString(value, i18n) {
        if (value === "-1") return i18n.t("common:companyFilter.missing");
        const key = revenueRangeValues.find(
            (item) => item === parseInt(value, 10)
        );
        return i18n.t(`common:companyFilter.revenueRange.${key}`);
    }

    sortedValues() {
        return this.values.sort((a, b) => a - b);
    }
}

class LocationMatcher extends FieldMatcher {
    static extractValue(company) {
        return company.location.countryCode;
    }

    static displayString(value, i18n, globalData) {
        return (globalData.countries[value] || {})[
            i18n.t("common:companyFilter.countryNameKey")
        ];
    }

    sortedValues(i18n, globalData) {
        // TODO: There's one company with a countryCode of `false` in the
        // data - should be filtered elsewhere.
        const filteredValues = this.values.filter((value) => value !== false);
        return filteredValues.sort((a, b) => {
            const [aString, bString] = [a, b].map(
                (value) =>
                    this.constructor.displayString(value, i18n, globalData) ||
                    "zz"
            );
            return aString.localeCompare(bString);
        });
    }
}

/**
 * Filters a list of {@link Company} objects based on their field values.
 */
export class CompanyFilter {
    constructor(companies = []) {
        this._matchers = new Map();
        this._matchers.set(
            "industryCategory",
            new IndustryCategoryMatcher(companies)
        );
        this._matchers.set("jurisdiction", new JurisdictionMatcher(companies));
        this._matchers.set("revenueRange", new RevenueRangeMatcher(companies));
        this._matchers.set("location", new LocationMatcher(companies));
    }

    add(field, value) {
        this._matchers.get(field).add(value);
    }

    remove(field, value) {
        this._matchers.get(field).delete(value);
    }

    has(field, value) {
        return this._matchers.get(field).has(value);
    }

    get empty() {
        return [...this._matchers.values()].every((matcher) => matcher.empty);
    }

    get fields() {
        return [...this._matchers.keys()];
    }

    values(field) {
        return this._matchers.get(field).values;
    }

    displayString(field, value, i18n, globalData) {
        return (
            this._matchers
                .get(field)
                .constructor.displayString(value, i18n, globalData) || value
        );
    }

    sortedValues(field, i18n, globalData) {
        return this._matchers.get(field).sortedValues(i18n, globalData);
    }

    matches(company) {
        return [...this._matchers.values()].every((matcher) =>
            matcher.matches(company)
        );
    }

    apply(companies) {
        return Object.values(companies).filter((company) =>
            this.matches(company)
        );
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
}
