"use strict";

class FieldMatcher {
    constructor(entities = []) {
        this._values = new Set(
            Object.values(entities).map((entity) =>
                this.constructor.extractValue(entity)
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

    matches(entity) {
        return this.empty || this.has(this.constructor.extractValue(entity));
    }
}

class IndustryCategoryMatcher extends FieldMatcher {
    static extractValue(entity) {
        return entity.industryCategoryName();
    }

    static displayString(value) {
        return value;
    }
}

class JurisdictionMatcher extends FieldMatcher {
    static extractValue(entity) {
        return entity.jurisdiction;
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
    static _mostRecentAnnualRevenue(entity) {
        const annualRevenues = entity.annualRevenues || [];
        if (!annualRevenues.length) return -1;
        const lastAnnualRevenue = [...annualRevenues]
            .sort((a, b) => a.year - b.year)
            .pop();
        return lastAnnualRevenue.amount / 1000;
    }

    static extractValue(entity) {
        const revenue = this._mostRecentAnnualRevenue(entity);
        if (revenue === -1) return "-1";
        const reversedRanges = revenueRangeValues.sort((a, b) => b - a);
        for (let step of reversedRanges) if (revenue > step) return `${step}`;
        return "0";
    }

    static displayString(value, i18n) {
        if (value === "-1") return i18n.t("common:entityFilter.missing");
        const key = revenueRangeValues.find(
            (item) => item === parseInt(value, 10)
        );
        return i18n.t(`common:entityFilter.revenueRange.${key}`);
    }

    sortedValues() {
        return this.values.sort((a, b) => a - b);
    }
}

class LocationMatcher extends FieldMatcher {
    static extractValue(entity) {
        return entity.location?.countryCode;
    }

    static displayString(value, i18n, globalData) {
        return (globalData.countries[value] || {})[
            i18n.t("common:entityFilter.countryNameKey")
        ];
    }

    sortedValues(i18n, globalData) {
        // TODO: There's one entity with a countryCode of `false` in the
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

class TypeMatcher extends FieldMatcher {
    static extractValue(entity) {
        return entity.type;
    }

    static displayString(value, i18n) {
        return i18n.t(`common:entityFilter.${value}`);
    }

    sortedValues() {
        return this.values.sort((a, b) => a.localeCompare(b));
    }
}

/**
 * Filters a list of {@link Entity} objects based on their field values.
 */
export class EntityFilter {
    constructor(entities = []) {
        this._matchers = new Map();
        this._matchers.set(
            "industryCategory",
            new IndustryCategoryMatcher(
                Object.fromEntries(
                    Object.entries(entities).filter(
                        ([, value]) => value.type == "company"
                    )
                )
            )
        );
        this._matchers.set("jurisdiction", new JurisdictionMatcher(entities));
        this._matchers.set("revenueRange", new RevenueRangeMatcher(entities));
        this._matchers.set("location", new LocationMatcher(entities));
        this._matchers.set("type", new TypeMatcher(entities));
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
        // Here must be logic to add icons to the String -> See designs of product/ company filters
        // Maybe change to displayHtml?
        return (
            this._matchers
                .get(field)
                .constructor.displayString(value, i18n, globalData) || value
        );
    }

    sortedValues(field, i18n, globalData) {
        return this._matchers.get(field).sortedValues(i18n, globalData);
    }

    matches(entity) {
        return [...this._matchers.values()].every((matcher) =>
            matcher.matches(entity)
        );
    }

    apply(entities) {
        return Object.values(entities).filter((entity) => this.matches(entity));
    }

    copy() {
        const copy = new EntityFilter();
        for (let field of this.fields)
            for (let value of this.values(field)) copy.add(field, value);
        return copy;
    }

    equal(other) {
        if (!(other instanceof EntityFilter)) return false;
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
