import React, { useState, useRef, useContext } from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import LinkButton from "../../components/buttons/linkButton/linkButton.jsx";

import "./entitySearch.css";
import { ExplorerContext } from "../../context/explorer-context.jsx";

const EntitySearchScreen = () => {
    const { entitiesList, featuredEntities } = useContext(ExplorerContext);
    const entities = entitiesList;

    const [searchString, setSearchString] = useState("");

    const shownEntitiesUnsorted =
        searchString.length > 3 ||
        entities.filter((entity) =>
            entity.name.toLowerCase().startsWith(searchString)
        ).length == 0
            ? entities.filter((c) =>
                  c.name.toLowerCase().includes(searchString)
              )
            : entities.filter((c) =>
                  c.name.toLowerCase().startsWith(searchString)
              );

    const shownEntities = shownEntitiesUnsorted.sort((a, b) =>
        a.compareNames(b)
    );
    const inputRef = useRef();

    const handleSearch = (inputString) => {
        setSearchString(inputString.toLowerCase());
    };

    const handleClear = () => {
        inputRef.current.value = "";
        setSearchString("");
        inputRef.current.focus();
    };

    return (
        <Screen className="entity-search-screen">
            <div className="search-bar-container">
                <div className="search-bar">
                    <input
                        type="text"
                        ref={inputRef}
                        autoFocus="autofocus"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="off"
                        placeholder={i18n.t("entitySearchScreen:typeHere")}
                        className="search-bar-input"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {searchString == "" ? null : (
                        <button
                            className={searchString ? "clr active" : "clr"}
                            onClick={() => handleClear()}
                        >
                            <img src="./images/clear-search.svg" />
                        </button>
                    )}
                </div>
            </div>
            <div className="entity-search">
                {searchString == "" ? (
                    <div className="suggestion-container">
                        <p>{i18n.t("entitySearchScreen:suggestions")}</p>
                        <div className="suggestions">
                            {" "}
                            {featuredEntities.map((entity, index) => (
                                <LinkButton
                                    route="entity-details"
                                    key={index}
                                    stateChange={{
                                        selectedEntity: entity.ppid,
                                    }}
                                >
                                    {entity.name}
                                </LinkButton>
                            ))}{" "}
                        </div>
                    </div>
                ) : (
                    <div>
                        {shownEntities.length == 0 ? (
                            <div>
                                <p className="no-answers">
                                    {i18n.t("entitySearchScreen:noMatch")}
                                </p>
                                <div className="suggestion-container">
                                    <p>
                                        {i18n.t(
                                            "entitySearchScreen:suggestions"
                                        )}
                                    </p>
                                    <div className="suggestions">
                                        {" "}
                                        {featuredEntities.map(
                                            (entity, index) => (
                                                <LinkButton
                                                    route="entity-details"
                                                    stateChange={{
                                                        selectedEntity:
                                                            entity.ppid,
                                                    }}
                                                    key={index}
                                                >
                                                    {entity.name}
                                                </LinkButton>
                                            )
                                        )}{" "}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {shownEntities.map((entity, index) => (
                                    <LinkButton
                                        route="entity-details"
                                        stateChange={{
                                            selectedEntity: entity.ppid,
                                        }}
                                        key={index}
                                    >
                                        {entity.name}
                                    </LinkButton>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Screen>
    );
};

export default EntitySearchScreen;
