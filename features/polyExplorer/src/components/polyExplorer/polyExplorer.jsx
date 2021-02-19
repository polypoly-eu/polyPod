import React, { useState } from "react";

import FeaturedCompanyHolder from "../featuredCompanyHolder/featuredCompanyHolder.jsx";
import CompanyList from "../companyList/companyList.jsx";
import SharedDataTypeScreen from "../screens/sharedDataTypeScreen/sharedDataTypeScreen.jsx";
import SharedPurposeScreen from "../screens/sharedPurposeScreen/sharedPurposeScreen.jsx";
import SharedWithCompaniesScreen from "../screens/sharedWithCompanyScreen/sharedWithCompanyScreen.jsx";
import SharedJurisdictionsScreen from "../screens/sharedJurisdictionsScreen/sharedJurisdictionsScreen.jsx";
import CompanyInfo from "../companyInfo/companyInfo.jsx";
import DummyPopUp from "../dummyPopUp/dummyPopUp.jsx";
import makeExampleData from "../dataViz/makeExampleData.jsx";
import "./polyExplorer.css";

// This is just a crutch until we have real callbacks for the info and
// search action.
function alert(text) {
    const handlePopUpClose = () => {
        window.podNav.setActiveActions(["info", "search"]);
        ReactDOM.render(<PolyExplorer />, document.getElementById("feature"));
    };

    window.podNav.actions.back = () => handlePopUpClose();
    window.podNav.setActiveActions(["back"]);
    ReactDOM.render(
        <DummyPopUp text={text} onPopUpClose={handlePopUpClose} />,
        document.getElementById("feature")
    );
}

if (window.podNav) {
    window.podNav.actions = {
        info: () => alert("Here be info!"),
        search: () => alert("Here be search!"),
    };
}

const PolyExplorer = () => {
    if (window.podNav)
        window.podNav.setActiveActions(["info", "search"])

    const [showFeatured, setShowFeatured] = useState(true);
    const [showScreen, setShowScreen] = useState("start");
    const [companyData] = useState(makeExampleData());
    const [selectedCompany, setSelectedCompany] = useState(undefined);
    const [featuredCompanyData] = useState(
        companyData.filter((e) => e.featured)
    );
    const [
        featuredCompanyTabInitialSlide,
        setfeaturedCompanyTabInitialSlide,
    ] = useState(0);

    const handleShowFeatureChange = (featured) => {
        setShowFeatured(featured);
    };

    const handleShowScreenChange = (showScreen, companyName) => {
        setShowScreen(showScreen);
        setSelectedCompany(
            companyData.filter((company) => companyName === company.name)[0]
        );
    };

    const handleUpdateInitalSlide = (newInitialSlide) => {
        setfeaturedCompanyTabInitialSlide(newInitialSlide);
    };

    const getScreenContent = () => {
        return screenOf[showScreen];
    };

    //All screens that can be rendered
    const screenOf = {
        start: (
            <div className="explorer-container">
                <div className="nav-button-container">
                    <button
                        onClick={() => handleShowFeatureChange(true)}
                        className={
                            showFeatured ? "nav-button active" : "nav-button"
                        }
                    >
                        Featured Companies
                    </button>
                    <button
                        onClick={() => handleShowFeatureChange(false)}
                        className={
                            showFeatured ? "nav-button" : "nav-button active"
                        }
                    >
                        All companies ({companyData.length})
                    </button>
                </div>
                {showFeatured ? (
                    <FeaturedCompanyHolder
                        featuredCompanies={featuredCompanyData}
                        onShowScreenChange={handleShowScreenChange}
                        initialSlide={featuredCompanyTabInitialSlide}
                        onUpdateInitialSlide={handleUpdateInitalSlide}
                    />
                ) : (
                    <CompanyList
                        companies={companyData}
                        onShowScreenChange={handleShowScreenChange}
                    />
                )}
            </div>
        ),
        //better filter from identifier than name
        dataTypes: (
            <SharedDataTypeScreen
                company={selectedCompany}
                onShowScreenChange={handleShowScreenChange}
            />
        ),
        purposes: (
            <SharedPurposeScreen
                company={selectedCompany}
                onShowScreenChange={handleShowScreenChange}
            />
        ),
        companies: (
            <SharedWithCompaniesScreen
                company={selectedCompany}
                onShowScreenChange={handleShowScreenChange}
            />
        ),
        jurisdictions: (
            <SharedJurisdictionsScreen
                company={selectedCompany}
                onShowScreenChange={handleShowScreenChange}
            />
        ),
        companyInfo: (
            <CompanyInfo
                company={selectedCompany}
                onShowScreenChange={handleShowScreenChange}
            />
        ),
    };

    //polyExplorer "render"
    return getScreenContent();
};

export default PolyExplorer;
