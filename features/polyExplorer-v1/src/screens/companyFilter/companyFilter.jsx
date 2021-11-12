import React, { useState } from "react";

import i18n from "../../i18n.js";
import { CompanyFilter } from "../../model/companyFilter.js";
import Scrollable from "../../components/scrollable/scrollable.jsx";
import Screen from "../../components/screen/screen.jsx";

import "./companyFilter.css";

const CompanyFilterScreen = ({
    companies,
    activeFilters,
    globalData,
    onApply,
}) => {
    const [newActiveFilters, setNewActiveFilters] = useState(
        activeFilters.copy()
    );

    const handleReset = () => setNewActiveFilters(new CompanyFilter());

    const allFilters = new CompanyFilter(companies);

    const isFilterActive = (field, value) => newActiveFilters.has(field, value);

    function handleToggle(field, value) {
        if (newActiveFilters.has(field, value))
            newActiveFilters.remove(field, value);
        else newActiveFilters.add(field, value);
        setNewActiveFilters(newActiveFilters.copy());
    }

    const FilterSection = ({ title, field }) => (
        <div className={`filter-section ${field}`}>
            <h1>{title}</h1>
            {allFilters
                .sortedValues(field, i18n, globalData)
                .map((value, index) => (
                    <button
                        key={index}
                        className={isFilterActive(field, value) ? "active" : ""}
                        onClick={() => handleToggle(field, value)}
                        dangerouslySetInnerHTML={{
                            __html: allFilters.displayString(
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

    const filtersChanged = () => !activeFilters.equal(newActiveFilters);

    function handleApply({ target }) {
        if (!target.className.includes("disabled")) onApply(newActiveFilters);
    }

    return (
        <Screen className="company-filter-screen">
            <button className="reset-button" onClick={handleReset}></button>
            <Scrollable>
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
            </Scrollable>

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
