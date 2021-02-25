import React, { useState } from "react";

import i18n from "../../../i18n.js";
import * as companyFilter from "../../../companyFilter.js";

import "../screen.css";
import "./companyFilterScreen.css";

const CompanyFilterScreen = ({ companies, activeFilters, onApply }) => {
    const [newActiveFilters, setNewActiveFilters] = useState(activeFilters);

    const handleReset = () => setNewActiveFilters(companyFilter.emptyFilters());

    const allFilters = companyFilter.extractFilters(companies);

    const isFilterActive = (field, value) =>
        companyFilter.hasFilter(newActiveFilters, field, value);

    function handleToggle(field, value) {
        const { hasFilter, addFilter, removeFilter } = companyFilter;
        if (hasFilter(newActiveFilters, field, value))
            removeFilter(newActiveFilters, field, value);
        else addFilter(newActiveFilters, field, value);
        setNewActiveFilters({ ...newActiveFilters });
    }

    const FilterSection = ({ title, field }) => (
        <div className="filter-section">
            <h1>{title}</h1>
            {companyFilter.values(allFilters, field).map((value, index) => (
                <button
                    key={index}
                    className={isFilterActive(field, value) ? "active" : ""}
                    onClick={() => handleToggle(field, value)}
                    dangerouslySetInnerHTML={{
                        __html: companyFilter.displayString(field, value),
                    }}
                ></button>
            ))}
        </div>
    );

    const handleApply = () => onApply(newActiveFilters);

    return (
        <div className="explorer-container">
            <div className="screen-content">
                <button className="reset-button" onClick={handleReset}></button>

                <FilterSection
                    title={i18n.t("companyFilterScreen:jurisdictions")}
                    field="jurisdiction"
                />

                <FilterSection
                    title={i18n.t("companyFilterScreen:locations")}
                    field="location"
                />

                <FilterSection
                    title={i18n.t("companyFilterScreen:revenue")}
                    field="revenueRange"
                />

                <button className="apply-button" onClick={handleApply}>
                    {i18n.t("companyFilterScreen:apply")}
                </button>
            </div>
        </div>
    );
};

export default CompanyFilterScreen;
