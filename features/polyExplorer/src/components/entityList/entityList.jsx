import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import EntityShortInfo from "../entityShortInfo/entityShortInfo.jsx";

import "./entityList.css";

function determineInitialGroups(entities) {
    const groups = Object.keys(entities);
    let remainingValues = 15;
    for (let i = 0; i < groups.length; i++) {
        remainingValues -= entities[groups[i]].length;
        if (remainingValues < 0) return Math.min(i + 2, groups.length);
    }
    return groups.length;
}

function EntityList({ entities, showGrouped, sideLabel }) {
    const allGroups = Object.keys(entities);
    const [loadedEntities, setLoadedEntities] = useState({});
    const [groupsToLoad, setGroupsToLoad] = useState(allGroups);
    const [hasMore, setHasMore] = useState(true);
    const listRef = useRef();

    function loadEntities() {
        // The current logic decides what to load on a group level, i.e. it
        // either loads an entire group, or it doesn't load it at all. For large
        // groups with many entities, this can lead to so many entity entries
        // being loaded (initially) that it causes notable performance problems.

        const initialGroupCount = determineInitialGroups(entities);

        const initialGroups = allGroups.slice(0, initialGroupCount);
        const loadedEntities = {};
        for (let group of initialGroups)
            loadedEntities[group] = entities[group];
        setLoadedEntities(loadedEntities);

        setGroupsToLoad(allGroups.slice(initialGroupCount));
    }

    function handleLoadMoreData() {
        if (groupsToLoad.length <= 0) {
            setHasMore(false);
            return;
        }
        const remainingGroupsToLoad = [...groupsToLoad];
        const newGroup = remainingGroupsToLoad.shift();
        setGroupsToLoad(remainingGroupsToLoad);
        setLoadedEntities({
            ...loadedEntities,
            [newGroup]: entities[newGroup],
        });
    }

    useEffect(() => {
        loadEntities();
    }, []);

    useEffect(() => {
        loadEntities();
        listRef.current.scrollTop = 0;
    }, [entities]);

    return (
        <div id="entity-list" className="entity-list" ref={listRef}>
            <InfiniteScroll
                dataLength={allGroups.length - groupsToLoad.length}
                next={handleLoadMoreData}
                scrollThreshold="80%"
                hasMore={hasMore}
                scrollableTarget="entity-list"
            >
                {Object.entries(loadedEntities).map(
                    ([label, entities], index) => (
                        <div
                            key={index}
                            className={
                                "entity-group" +
                                (showGrouped && sideLabel ? " side-label" : "")
                            }
                        >
                            {showGrouped && (
                                <>
                                    <hr />
                                    <div className="entity-group-label">
                                        {label +
                                            (sideLabel
                                                ? ""
                                                : ` (${entities.length})`)}
                                    </div>
                                </>
                            )}
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
    );
}

function normalizeEntities(entities) {
    const validEntities = typeof entities == "object" ? entities : [];
    return Array.isArray(validEntities)
        ? { null: validEntities }
        : validEntities;
}

export default (props) => {
    const entities = normalizeEntities(props.entities);
    const showGrouped =
        "showGrouped" in props ? props.showGrouped : Object.keys(entities) > 1;
    const sideLabel =
        "sideLabel" in props
            ? props.sideLabel
            : Object.keys(props.entities).every((label) => label?.length === 1);
    return EntityList({
        ...props,
        entities,
        showGrouped,
        sideLabel,
    });
};
