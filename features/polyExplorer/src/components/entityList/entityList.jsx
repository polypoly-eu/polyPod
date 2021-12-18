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

function EntityList({ entities, sideLabel }) {
    const allGroups = Object.keys(entities);
    const [loadedEntities, setLoadedEntities] = useState({});
    const [groupsToLoad, setGroupsToLoad] = useState(allGroups);
    const [hasMore, setHasMore] = useState(true);
    const listRef = useRef();

    function loadEntities() {
        // This logic is currently not very efficient for an initial group with
        // a large amount of entities in it, since it never loads partial groups.
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
                                (sideLabel ? " side-label" : "")
                            }
                        >
                            <hr />
                            <div className="entity-group-label">
                                {label +
                                    (sideLabel ? "" : ` (${entities.length})`)}
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
    );
}

export default (props) => {
    const sideLabel =
        "sideLabel" in props
            ? props.sideLabel
            : Object.keys(props.entities).every((label) => label?.length === 1);
    return EntityList({
        ...props,
        sideLabel,
    });
};
