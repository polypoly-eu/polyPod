import React, { useContext, useState } from "react";

import i18n from "../../i18n.js";
import { EntityFilter } from "../../model/entityFilter.js";
import Scrollable from "../../components/scrollable/scrollable.jsx";
import Screen from "../../components/screen/screen.jsx";

import "./entityFilter.css";
import LinkButton from "../../components/buttons/linkButton/linkButton.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";

const EntityFilterScreen = () => {
    const { entities, activeFilters, globalData, handleFilterApply } =
        useContext(ExplorerContext);
    const [newActiveFilters, setNewActiveFilters] = useState(
        activeFilters.copy()
    );

    const handleReset = () => setNewActiveFilters(new EntityFilter());

    const allFilters = new EntityFilter(entities);

    const isFilterActive = (field, value) => newActiveFilters.has(field, value);

    function handleToggle(field, value) {
        if (newActiveFilters.has(field, value))
            newActiveFilters.remove(field, value);
        else newActiveFilters.add(field, value);
        setNewActiveFilters(newActiveFilters.copy());
    }

    const FilterSection = ({ title, field }) => (
        <div className={`filter-section ${field}`}>
            {title ? <h1>{title}</h1> : null}
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
        if (!target.className.includes("disabled"))
            handleFilterApply(newActiveFilters);
    }

    return (
        <Screen className="entity-filter-screen">
            <button className="reset-button" onClick={handleReset}></button>
            <Scrollable>
                <FilterSection title={null} field="type" />

                <FilterSection
                    title={i18n.t("entityFilterScreen:industryCategories")}
                    field="industryCategory"
                />

                <FilterSection
                    title={i18n.t("entityFilterScreen:jurisdictions")}
                    field="jurisdiction"
                />

                <FilterSection
                    title={i18n.t("entityFilterScreen:locations")}
                    field="location"
                />

                <FilterSection
                    title={i18n.t("entityFilterScreen:revenue")}
                    field="revenueRange"
                />
            </Scrollable>

            <div className="button-area" onClick={handleApply}>
                <LinkButton
                    route="/"
                    className={
                        "apply-button" + (filtersChanged() ? "" : " disabled")
                    }
                >
                    {i18n.t("entityFilterScreen:apply")}
                </LinkButton>
            </div>
        </Screen>
    );
};

export default EntityFilterScreen;
