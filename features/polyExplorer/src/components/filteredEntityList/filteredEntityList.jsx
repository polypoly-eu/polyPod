import React, { useState, useEffect, useRef, useContext } from "react";

import i18n from "../../i18n.js";
import EntityShortInfo from "../entityShortInfo/entityShortInfo.jsx";
import InfiniteScroll from "react-infinite-scroll-component";

import "./filteredEntityList.css";
import LinkButton from "../buttons/linkButton/linkButton.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";

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

//number of groups needed to fill first screen
function getStartGroups(entityGroups) {
    let numberGroups = 0;
    let numberValues = 0;
    const keys = Object.keys(entityGroups);
    for (let e of keys) {
        numberGroups++;
        numberValues += entityGroups[e].length;
        if (numberValues > 15) return keys[numberGroups];
    }
    return keys.pop();
}

const FilteredEntityList = () => {
    const { entities, globalData, activeFilters, handleRemoveFilter } =
        useContext(ExplorerContext);
    const onRemoveFilter = handleRemoveFilter;
    const filteredEntities = activeFilters.apply(entities);
    const entityGroups = groupEntities(filteredEntities);
    const allKeys = Object.keys(entityGroups);
    const [loadedEntities, setLoadedEntities] = useState({});
    const [toLoadKeys, setToLoadKeys] = useState(allKeys);
    const [hasMore, setHasMore] = useState(true);
    const listRef = useRef();

    const handleLoadMoreData = () => {
        if (toLoadKeys.length > 0) {
            const moreEntities = { ...loadedEntities };
            const loadKeys = [...toLoadKeys];
            const newKey = loadKeys.shift();
            moreEntities[newKey] = entityGroups[newKey];
            setToLoadKeys(loadKeys);
            setLoadedEntities(moreEntities);
        } else setHasMore(false);
    };

    const handleReloadEntities = (field, value) => {
        onRemoveFilter(field, value);
        const newLoadedEntities = {};
        const filteredEntities = activeFilters.apply(entities);
        const newEntityGroups = groupEntities(filteredEntities);
        const newKeys = Object.keys(newEntityGroups);
        const newStartGroups = getStartGroups(newEntityGroups);
        for (
            let i = 0;
            i <= Object.keys(newEntityGroups).indexOf(newStartGroups);
            i++
        ) {
            newLoadedEntities[newKeys[i]] = newEntityGroups[newKeys[i]];
        }
        setLoadedEntities(newLoadedEntities);
        const toLoadKeys = [...newKeys];
        toLoadKeys.splice(0, newKeys.indexOf(newStartGroups));
        setToLoadKeys(toLoadKeys);
        listRef.current.scrollTop = 0;
    };

    useEffect(() => {
        const loadedEntities = {};
        const startGroups = getStartGroups(entityGroups);
        for (let i = 0; i <= allKeys.indexOf(startGroups); i++) {
            loadedEntities[allKeys[i]] = entityGroups[allKeys[i]];
        }
        setLoadedEntities(loadedEntities);
        const toLoadKeys = [...allKeys];
        toLoadKeys.splice(0, allKeys.indexOf(startGroups));
        setToLoadKeys(toLoadKeys);
    }, []);

    return (
        <div
            id="filtered-entity-list"
            className="filtered-entity-list"
            ref={listRef}
        >
            <ActiveFilters
                activeFilters={activeFilters}
                globalData={globalData}
                onRemoveFilter={handleReloadEntities}
            />
            <div
                className={
                    "entities" + (activeFilters.empty ? "" : " filters-visible")
                }
            >
                <LinkButton
                    route="/entity-filters"
                    className={
                        "filter-button" +
                        (activeFilters.empty ? "" : " filter-button-active")
                    }
                >
                    <img
                        src="./images/filter-background.svg"
                        alt="Filter button"
                    />
                </LinkButton>
                <InfiniteScroll
                    dataLength={allKeys.length - toLoadKeys.length}
                    next={handleLoadMoreData}
                    scrollThreshold="80%"
                    hasMore={hasMore}
                    scrollableTarget="filtered-entity-list"
                >
                    {Object.entries(loadedEntities).map(
                        ([label, entities], index) => (
                            <div key={index} className="entity-group">
                                <div className="entity-group-label">
                                    {label}
                                </div>
                                <div className="entity-group-entities">
                                    {entities.map((entity, index) => (
                                        <EntityShortInfo
                                            key={index}
                                            entity={entity}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default FilteredEntityList;
