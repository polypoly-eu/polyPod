import React, { useContext } from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import CompanyList from "../../components/companyList/companyList.jsx";

import "./main.css";
import { ExplorerContext } from "../../context/explorer-context.jsx";

const MainScreen = () => {
    const { showClusters, setShowClusters, companies } = useContext(
        ExplorerContext
    );

    return (
        <Screen className="main-screen" topShadow={false}>
            <div className="nav-button-container">
                <button
                    onClick={() => setShowClusters(true)}
                    className={
                        showClusters ? "nav-button active" : "nav-button"
                    }
                >
                    {i18n.t("mainScreen:tab.discover")}
                </button>
                <button
                    onClick={() => setShowClusters(false)}
                    className={
                        showClusters ? "nav-button" : "nav-button active"
                    }
                >
                    {i18n.t("mainScreen:tab.explore", {
                        total: Object.keys(companies).length,
                    })}
                </button>
            </div>
            {showClusters ? <div></div> : <CompanyList />}
        </Screen>
    );
};

export default MainScreen;
