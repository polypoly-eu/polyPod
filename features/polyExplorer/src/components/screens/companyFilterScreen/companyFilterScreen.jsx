import React, { useState } from "react";

import i18n from "../../../i18n.js";

import "../screen.css";
import "./companyFilterScreen.css";

const allRevenueRanges = {
    0: "&euro; 0 - 100k",
    100: "&euro; 100k - 500k",
    500: "&euro; 500k - 1M",
    1000: "&euro; 1M - 5M",
    5000: "&euro; 5M - 20M",
    20000: "&euro; 20M - 50M",
    50000: "&euro; 50M - 100M",
    100000: "&euro; 100M - 1B",
    1000000: "&euro; 1B &ge;",
};

function mostRecentYearlyProfit(company) {
    const profitPerYearEntries = company.yearlyProfits.map(
        ({ year, profits }) => [year, profits]
    );
    if (!profitPerYearEntries.length) return 0;
    const profitPerYear = Object.fromEntries(profitPerYearEntries);
    const mostRecentYear = Math.max(...Object.keys(profitPerYear));
    return profitPerYear[mostRecentYear].reduce((a, b) => a + b, 0);
}

function revenueRangeStart(revenue) {
    for (let step of Object.keys(allRevenueRanges).sort((a, b) => b - a))
        if (revenue > step) return step;
    return 0;
}

function extractFilterOptions(companies) {
    const filterOptions = {
        jurisdictions: new Set(),
        locations: new Set(),
        revenueRanges: new Set(),
    };
    for (let company of companies) {
        filterOptions.locations.add(company.location.countryCode);
        filterOptions.jurisdictions.add(company.jurisdiction);
        const yearlyProfit = mostRecentYearlyProfit(company);
        filterOptions.revenueRanges.add(revenueRangeStart(yearlyProfit));
    }
    return filterOptions;
}

const CompanyFilterScreen = ({ companies }) => {
    const [activeFilters, setActiveFilters] = useState({});

    const resetFilters = () => setActiveFilters({});

    function toggleFilterOption(category, option) {
        const options = (activeFilters[category] =
            activeFilters[category] || new Set());
        if (options.has(option)) options.delete(option);
        else options.add(option);
        setActiveFilters({ ...activeFilters });
    }

    function isFilterOptionActive(category, option) {
        if (!(category in activeFilters)) return false;
        return activeFilters[category].has(option);
    }

    const possibleFilters = extractFilterOptions(companies);

    const FilterSection = ({ title, category, displayText }) => (
        <div className="filter-section">
            <h1>{title}</h1>
            {[...possibleFilters[category]].map((option, index) => (
                <button
                    key={index}
                    className={
                        isFilterOptionActive(category, option) ? "active" : ""
                    }
                    onClick={() => toggleFilterOption(category, option)}
                    dangerouslySetInnerHTML={{ __html: displayText(option) }}
                ></button>
            ))}
        </div>
    );

    return (
        <div className="explorer-container">
            <div className="screen-content">
                <button className="reset-button" onClick={resetFilters}>
                    RESET
                </button>

                <FilterSection
                    title={i18n.t("companyFilterScreen:jurisdictions")}
                    category="jurisdictions"
                    displayText={(option) => option}
                />

                <FilterSection
                    title={i18n.t("companyFilterScreen:locations")}
                    category="locations"
                    displayText={(option) => option}
                />

                <FilterSection
                    title={i18n.t("companyFilterScreen:revenue")}
                    category="revenueRanges"
                    displayText={(option) => allRevenueRanges[option]}
                />

                <button className="apply-button">
                    {i18n.t("companyFilterScreen:apply")}
                </button>
            </div>
        </div>
    );
};

export default CompanyFilterScreen;
