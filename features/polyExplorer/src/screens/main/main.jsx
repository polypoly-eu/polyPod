import React, { useContext } from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import EntityList from "../../components/entityList/entityList.jsx";

import "./main.css";
import { ExplorerContext } from "../../context/explorer-context.jsx";

const MainScreen = () => {
    const { navigationState, routeTo, entities } = useContext(ExplorerContext);
    let showClusters = navigationState.showClusters;

    return (
        <Screen className="main-screen" topShadow={false}>
            <div className="nav-button-container">
                <button
                    onClick={() => routeTo("main", { showClusters: true })}
                    className={
                        showClusters ? "nav-button active" : "nav-button"
                    }
                >
                    {i18n.t("mainScreen:tab.discover")}
                </button>
                <button
                    onClick={() => routeTo("main", { showClusters: false })}
                    className={
                        showClusters ? "nav-button" : "nav-button active"
                    }
                >
                    {i18n.t("mainScreen:tab.explore", {
                        total: Object.keys(entities).length,
                    })}
                </button>
            </div>
            {showClusters ? <div></div> : <EntityList />}
        </Screen>
    );
};

export default MainScreen;
