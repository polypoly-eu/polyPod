import React, { useContext } from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import CompanyList from "../../components/companyList/companyList.jsx";
import StoriesPreview from "../../components/storiesPreview/storiesPreview.jsx";

import "./main.css";
import { ExplorerContext } from "../../context/explorer-context.jsx";

const MainScreen = () => {
    const { navigationState, routeTo, companies, storiesMetadata } = useContext(
        ExplorerContext
    );
    let showClusters = navigationState.showClusters;

    return (
        <div className="main-screen">
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
                        total: Object.keys(companies).length,
                    })}
                </button>
            </div>
            {showClusters ? (
                <Screen className="main-screen" light={true}>
                    <StoriesPreview storiesMetadata={storiesMetadata} />
                </Screen>
            ) : (
                <Screen className="main-screen">
                    <CompanyList />
                </Screen>
            )}
        </div>
    );
};

export default MainScreen;
