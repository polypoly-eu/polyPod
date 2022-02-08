import React, { useContext, useState } from "react";

import i18n from "../../i18n.js";

import EntityList from "../entityList/entityList.jsx";
import LinkButton from "../buttons/linkButton/linkButton.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";

import "./filteredEntityList.css";

function groupEntities(entities) {
    const sorted = entities.sort((a, b) => a.compareNames(b));
    const groups = {};
    sorted.forEach((entity) => {
        const key = entity.nameIndexCharacter.toUpperCase();
        groups[key] = groups[key] || [];
        groups[key].push(entity);
    });
    return groups;
}

const ActiveFilters = ({ activeFilters, globalData, onRemoveFilter }) => {
    const filterList = [];
    for (let field of activeFilters.fields)
        for (let value of activeFilters.sortedValues(field, i18n, globalData))
            filterList.push([field, value]);
    return (
        <div className="active-filters">
            {filterList.map(([field, value], index) => (
                <button
                    key={index}
                    className={field}
                    onClick={() => onRemoveFilter(field, value)}
                    dangerouslySetInnerHTML={{
                        __html: activeFilters.displayString(
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
};

const FilteredEntityList = () => {
    const {
        entities,
        globalData,
        activeFilters,
        handleRemoveFilter: onRemoveFilter,
    } = useContext(ExplorerContext);
    const [entityGroups, setEntityGroups] = useState(createEntityGroups());

    function createEntityGroups() {
        const filteredEntities = activeFilters.apply(entities);
        return groupEntities(filteredEntities);
    }

    function handleRemoveFilter(field, value) {
        onRemoveFilter(field, value);
        setEntityGroups(createEntityGroups());
    }

    return (
        <>
            <div className="filtered-entity-list">
                <ActiveFilters
                    activeFilters={activeFilters}
                    globalData={globalData}
                    onRemoveFilter={handleRemoveFilter}
                />
                <div
                    className={
                        "entity-list-wrapper" +
                        (activeFilters.empty ? "" : " filters-visible")
                    }
                >
                    <EntityList entities={entityGroups} />
                </div>
            </div>
            <LinkButton
                route="/entity-filters"
                className={
                    "filter-button" +
                    (activeFilters.empty ? "" : " filter-button-active")
                }
            >
                <img src="./images/filter-background.svg" alt="Filter button" />
            </LinkButton>
        </>
    );
};

export default FilteredEntityList;
