import React from "react";

import i18n from "../../../i18n.js";
import FeaturedCompanyHolder from "../../featuredCompanyHolder/featuredCompanyHolder.jsx";
import CompanyList from "../../companyList/companyList.jsx";

import "../screen.css";
import "./mainScreen.css";

const MainScreen = ({
    handleShowScreenChange,
    featuredCompanyData,
    companyData,
    showFeatured,
    setShowFeatured,
    featuredCompanyTabInitialSlide,
    setFeaturedCompanyTabInitialSlide,
}) => {
    const handleShowFeatured = () => setShowFeatured(true);
    const handleShowCompanyList = () => setShowFeatured(false);

    const handleUpdateInitialSlide = (newInitialSlide) => {
        setFeaturedCompanyTabInitialSlide(newInitialSlide);
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
                    {i18n.t("polyExplorer:tabLabel.featuredCompanies")}
                </button>
                <button
                    onClick={handleShowCompanyList}
                    className={
                        showFeatured ? "nav-button" : "nav-button active"
                    }
                >
                    {i18n.t("polyExplorer:tabLabel.allCompanies", {
                        total: companyData.length,
                    })}
                </button>
            </div>
            {showFeatured ? (
                <FeaturedCompanyHolder
                    featuredCompanies={featuredCompanyData}
                    onShowScreenChange={handleShowScreenChange}
                    initialSlide={featuredCompanyTabInitialSlide}
                    onUpdateInitialSlide={handleUpdateInitialSlide}
                />
            ) : (
                <CompanyList
                    companies={companyData}
                    onShowScreenChange={handleShowScreenChange}
                />
            )}
        </div>
    );
};

export default MainScreen;
