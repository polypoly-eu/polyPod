import React, { useContext } from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import FilteredEntityList from "../../components/filteredEntityList/filteredEntityList.jsx";
import StoriesPreview from "../../components/storiesPreview/storiesPreview.jsx";

import "./main.css";
import { ExplorerContext } from "../../context/explorer-context.jsx";

const MainScreen = () => {
    const { navigationState, routeTo, entities, storiesMetadata } =
        useContext(ExplorerContext);
    let showClusters = navigationState.showClusters;

    return (
        <div className="nav-button-container poly-nav-bar-separator-bottom">
            <button
                onClick={() => routeTo("main", { showClusters: true })}
                className={showClusters ? "nav-button active" : "nav-button"}
            >
                {i18n.t("mainScreen:tab.discover")}
            </button>
            <button
                onClick={() => routeTo("main", { showClusters: false })}
                className={showClusters ? "nav-button" : "nav-button active"}
            >
                {i18n.t("mainScreen:tab.explore", {
                    total: Object.keys(entities).length,
                })}
            </button>
            <Screen
                className="main-screen"
                topShadow={false}
                theme={showClusters ? "poly-theme-light" : "poly-theme-dark"}
            >
                {showClusters ? (
                    <StoriesPreview storiesMetadata={storiesMetadata} />
                ) : (
                    <FilteredEntityList />
                )}
            </Screen>
        </div>
    );
};

export default MainScreen;
