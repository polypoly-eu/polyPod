import React, { useState } from "react";

import i18n from "../../i18n.js";
import * as companyFilter from "../../companyFilter.js";
import Screen from "../../components/screen/screen.jsx";

import "./companyFilter.css";

const CompanyFilterScreen = ({
    companies,
    activeFilters,
    globalData,
    onApply,
}) => {
    const [newActiveFilters, setNewActiveFilters] = useState(
        companyFilter.copy(activeFilters)
    );

    const handleReset = () => setNewActiveFilters(companyFilter.emptyFilters());

    const allFilters = companyFilter.sortFilters(
        companyFilter.extractFilters(companies),
        i18n,
        globalData
    );

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
        <div className={`filter-section ${field}`}>
            <h1>{title}</h1>
            {companyFilter.values(allFilters, field).map((value, index) => (
                <button
                    key={index}
                    className={isFilterActive(field, value) ? "active" : ""}
                    onClick={() => handleToggle(field, value)}
                    dangerouslySetInnerHTML={{
                        __html: companyFilter.displayString(
                            field,
                            value,
                            i18n,
                            globalData
                        ),
                    }}
                ></button>
            ))}
        </div>
    );

    const filtersChanged = () =>
        !companyFilter.equal(activeFilters, newActiveFilters);

    function handleApply({ target }) {
        if (!target.className.includes("disabled")) onApply(newActiveFilters);
    }

    return (
        <Screen className="company-filter-screen">
            <button className="reset-button" onClick={handleReset}></button>

            <FilterSection
                title={i18n.t("companyFilterScreen:industryCategories")}
                field="industryCategory"
            />

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

            <div className="button-area">
                <button
                    className={
                        "apply-button" + (filtersChanged() ? "" : " disabled")
                    }
                    onClick={handleApply}
                >
                    {i18n.t("companyFilterScreen:apply")}
                </button>
            </div>
        </Screen>
    );
};

export default CompanyFilterScreen;
