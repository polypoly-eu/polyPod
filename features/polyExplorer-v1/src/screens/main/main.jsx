import React from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import FeaturedCompanyHolder from "../../components/featuredCompanyHolder/featuredCompanyHolder.jsx";
import CompanyList from "../../components/companyList/companyList.jsx";

import "./main.css";

const MainScreen = ({
    showFeatured,
    featuredCompanies,
    companies,
    globalData,
    onOpenDetails,
    onOpenFeaturedInfo,
    onOpenFilters,
    onShowFeaturedChange,
    featuredCompanyTabInitialSlide,
    onFeaturedCompanyTabInitialSlideChange,
    activeFilters,
    onRemoveFilter,
    featuredCompanyMaxValues,
    featuredCompanyAverageValues,
    onOpenDataExplorationSection,
}) => {
    const handleShowFeatured = () => onShowFeaturedChange(true);
    const handleShowCompanyList = () => onShowFeaturedChange(false);

    const handleUpdateInitialSlide = (newInitialSlide) => {
        onFeaturedCompanyTabInitialSlideChange(newInitialSlide);
    };

    return (
        <Screen className="main-screen" topShadow={false}>
            <div className="nav-button-container poly-nav-bar-separator-bottom">
                <button
                    onClick={handleShowFeatured}
                    className={
                        showFeatured ? "nav-button active" : "nav-button"
                    }
                >
                    {i18n.t("mainScreen:tab.featuredCompanies")}
                </button>
                <button
                    onClick={handleShowCompanyList}
                    className={
                        showFeatured ? "nav-button" : "nav-button active"
                    }
                >
                    {i18n.t("mainScreen:tab.allCompanies", {
                        total: Object.keys(companies).length,
                    })}
                </button>
            </div>
            {showFeatured ? (
                <FeaturedCompanyHolder
                    featuredCompanies={featuredCompanies}
                    onOpenDetails={onOpenDetails}
                    onOpenInfo={onOpenFeaturedInfo}
                    initialSlide={featuredCompanyTabInitialSlide}
                    onUpdateInitialSlide={handleUpdateInitialSlide}
                    maxValues={featuredCompanyMaxValues}
                    averageValues={featuredCompanyAverageValues}
                    onOpenDataExplorationSection={onOpenDataExplorationSection}
                />
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
