import React from "react";

import i18n from "../../../i18n.js";
import FeaturedCompanyHolder from "../../featuredCompanyHolder/featuredCompanyHolder.jsx";
import CompanyList from "../../companyList/companyList.jsx";

import "../screen.css";
import "./mainScreen.css";

const MainScreen = ({
    showFeatured,
    featuredCompanyData,
    companyData,
    onShowScreenChange,
    onShowFeaturedChange,
    featuredCompanyTabInitialSlide,
    onFeaturedCompanyTabInitialSlideChange,
    activeFilters,
    onRemoveFilter,
}) => {
    const handleShowFeatured = () => onShowFeaturedChange(true);
    const handleShowCompanyList = () => onShowFeaturedChange(false);

    const handleUpdateInitialSlide = (newInitialSlide) => {
        onFeaturedCompanyTabInitialSlideChange(newInitialSlide);
    };

    return (
        <div className="explorer-container">
            <div className="nav-button-container">
                <button
                    onClick={handleShowFeatured}
                    className={
                        showFeatured ? "nav-button active" : "nav-button"
                    }
                >
                    {i18n.t("mainScreen:tabLabel.featuredCompanies")}
                </button>
                <button
                    onClick={handleShowCompanyList}
                    className={
                        showFeatured ? "nav-button" : "nav-button active"
                    }
                >
                    {i18n.t("mainScreen:tabLabel.allCompanies", {
                        total: companyData.length,
                    })}
                </button>
            </div>
            {showFeatured ? (
                <FeaturedCompanyHolder
                    featuredCompanies={featuredCompanyData}
                    onShowScreenChange={onShowScreenChange}
                    initialSlide={featuredCompanyTabInitialSlide}
                    onUpdateInitialSlide={handleUpdateInitialSlide}
                />
            ) : (
                <CompanyList
                    companies={companyData}
                    onShowScreenChange={onShowScreenChange}
                    activeFilters={activeFilters}
                    onRemoveFilter={onRemoveFilter}
                />
            )}
        </div>
    );
};

export default MainScreen;
