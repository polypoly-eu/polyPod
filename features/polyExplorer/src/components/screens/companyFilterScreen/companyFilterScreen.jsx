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

function revenueRangeStart(revenue) {
    for (let step of Object.keys(allRevenueRanges).sort((a, b) => b - a))
        if (revenue > step) return step;
    return 0;
}

function mostRecentYearlyProfit(company) {
    const profitPerYearEntries = company.yearlyProfits.map(
        ({ year, profits }) => [year, profits]
    );
    if (!profitPerYearEntries.length) return 0;
    const profitPerYear = Object.fromEntries(profitPerYearEntries);
    const mostRecentYear = Math.max(...Object.keys(profitPerYear));
    return profitPerYear[mostRecentYear].reduce((a, b) => a + b, 0);
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
    const [filteredJurisdictions, setFilteredJurisdictions] = useState(
        new Set()
    );
    const [filteredLocations, setFilteredLocations] = useState(new Set());
    const [filteredRevenueRanges, setFilteredRevenueRanges] = useState(
        new Set()
    );

    function resetFilters() {
        setFilteredJurisdictions(new Set());
        setFilteredLocations(new Set());
        setFilteredRevenueRanges(new Set());
    }

    function toggleFilterOption(options, setOptions, option) {
        if (options.has(option)) options.delete(option);
        else options.add(option);
        setOptions(new Set(options));
    }

    const toggleJurisdiction = (jurisdiction) =>
        toggleFilterOption(
            filteredJurisdictions,
            setFilteredJurisdictions,
            jurisdiction
        );

    const toggleLocation = (location) =>
        toggleFilterOption(filteredLocations, setFilteredLocations, location);

    const toggleRevenueRange = (revenueRange) =>
        toggleFilterOption(
            filteredRevenueRanges,
            setFilteredRevenueRanges,
            revenueRange
        );

    const { jurisdictions, locations, revenueRanges } = extractFilterOptions(
        companies
    );

    return (
        <div className="explorer-container">
            <div className="screen-content">
                <button
                    className="reset-button"
                    onClick={resetFilters}>
                    RESET
                </button>

                <h1>{i18n.t("companyFilterScreen:jurisdictions")}</h1>
                <div className="filter-options">
                    {[...jurisdictions].map((jurisdiction, index) => (
                        <button
                            key={index}
                            className={
                                filteredJurisdictions.has(jurisdiction)
                                    ? "active"
                                    : ""
                            }
                            onClick={() => toggleJurisdiction(jurisdiction)}
                        >
                            {jurisdiction}
                        </button>
                    ))}
                </div>

                <h1>{i18n.t("companyFilterScreen:locations")}</h1>
                <div className="filter-options">
                    {[...locations].map((location, index) => (
                        <button
                            key={index}
                            className={
                                filteredLocations.has(location) ? "active" : ""
                            }
                            onClick={() => toggleLocation(location)}
                        >
                            {location}
                        </button>
                    ))}
                </div>

                <h1>{i18n.t("companyFilterScreen:revenue")}</h1>
                <div className="filter-options">
                    {[...revenueRanges].map((revenueRange, index) => (
                        <button
                            key={index}
                            className={
                                filteredRevenueRanges.has(revenueRange)
                                    ? "active"
                                    : ""
                            }
                            onClick={() => toggleRevenueRange(revenueRange)}
                            dangerouslySetInnerHTML={{
                                __html: allRevenueRanges[revenueRange],
                            }}
                        ></button>
                    ))}
                </div>

                <button className="apply-button">
                    {i18n.t("companyFilterScreen:apply")}
                </button>
            </div>
        </div>
    );
};

export default CompanyFilterScreen;
