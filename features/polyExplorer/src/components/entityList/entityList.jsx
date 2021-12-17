import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import EntityShortInfo from "../entityShortInfo/entityShortInfo.jsx";

import "./entityList.css";

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

function EntityList({ entityGroups, sideLabel }) {
    const allKeys = Object.keys(entityGroups);
    const [loadedEntities, setLoadedEntities] = useState({});
    const [toLoadKeys, setToLoadKeys] = useState(allKeys);
    const [hasMore, setHasMore] = useState(true);
    const listRef = useRef();

    function loadEntities() {
        const loadedEntities = {};
        const startGroups = getStartGroups(entityGroups);
        for (let i = 0; i <= allKeys.indexOf(startGroups); i++) {
            loadedEntities[allKeys[i]] = entityGroups[allKeys[i]];
        }
        setLoadedEntities(loadedEntities);
        const toLoadKeys = [...allKeys];
        toLoadKeys.splice(0, allKeys.indexOf(startGroups));
        setToLoadKeys(toLoadKeys);
    }

    function handleLoadMoreData() {
        if (toLoadKeys.length > 0) {
            const moreEntities = { ...loadedEntities };
            const loadKeys = [...toLoadKeys];
            const newKey = loadKeys.shift();
            moreEntities[newKey] = entityGroups[newKey];
            setToLoadKeys(loadKeys);
            setLoadedEntities(moreEntities);
        } else setHasMore(false);
    }

    useEffect(() => {
        loadEntities();
    }, []);

    useEffect(() => {
        loadEntities();
        listRef.current.scrollTop = 0;
    }, [entityGroups]);

    return (
        <div id="entity-list" className="entity-list" ref={listRef}>
            <InfiniteScroll
                dataLength={allKeys.length - toLoadKeys.length}
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
            : Object.keys(props.entityGroups).every(
                  (label) => label?.length === 1
              );
    return EntityList({
        ...props,
        sideLabel,
    });
};
