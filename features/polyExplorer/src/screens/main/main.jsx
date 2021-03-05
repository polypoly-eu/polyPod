import React, { useState } from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import FeaturedCompanyHolder from "../../components/featuredCompanyHolder/featuredCompanyHolder.jsx";
import CompanyList from "../../components/companyList/companyList.jsx";

import "./main.css";

//Only temporary
import ConstructionPopup from "../../components/constructionPopup/constructionPopup.jsx";

const MainScreen = ({
    showFeatured,
    featuredCompanyData,
    companyData,
    globalData,
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

    //Only temporary
    const [showConstructionPopup, setShowConstructionPopUp] = useState(false);

    return (
        <Screen className="main-screen" topShadow={false}>
            <div className="nav-button-container">
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
                    setShowConstructionPopUp={setShowConstructionPopUp}
                />
            ) : (
                <CompanyList
                    companies={companyData}
                    globalData={globalData}
                    onShowScreenChange={onShowScreenChange}
                    activeFilters={activeFilters}
                    onRemoveFilter={onRemoveFilter}
                />
            )}
            {showConstructionPopup ? (
                <ConstructionPopup
                    onClose={() => setShowConstructionPopUp(false)}
                />
            ) : null}
        </Screen>
    );
};

export default MainScreen;
