import React from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import CompanyList from "../../components/companyList/companyList.jsx";
import LinkButton from "../../components/linkButton/linkButton.jsx";

import "./main.css";

const MainScreen = ({
    showClusters,
    companies,
    globalData,
    onOpenDetails,
    onOpenFilters,
    onShowClustersChange,
    activeFilters,
    onRemoveFilter,
}) => {
    const handleShowClusters = () => onShowClustersChange(true);
    const handleShowCompanyList = () => onShowClustersChange(false);

    return (
        <Screen className="main-screen" topShadow={false}>
            <div className="nav-button-container">
                <button
                    onClick={handleShowClusters}
                    className={
                        showClusters ? "nav-button active" : "nav-button"
                    }
                >
                    {i18n.t("mainScreen:tab.discover")}
                </button>
                <button
                    onClick={handleShowCompanyList}
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
                <div></div>
            ) : (
                <CompanyList
                    companies={companies}
                    globalData={globalData}
                    onOpenFilters={onOpenFilters}
                    onOpenDetails={onOpenDetails}
                    activeFilters={activeFilters}
                    onRemoveFilter={onRemoveFilter}
                />
            )}
        </Screen>
    );
};

export default MainScreen;
