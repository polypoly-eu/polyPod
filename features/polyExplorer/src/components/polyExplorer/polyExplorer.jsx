import React, { useState } from "react";
import * as ReactDOM from "react-dom";

import MainScreen from "../screens/mainScreen/mainScreen.jsx";
import SharedDataTypeScreen from "../screens/sharedDataTypeScreen/sharedDataTypeScreen.jsx";
import SharedPurposeScreen from "../screens/sharedPurposeScreen/sharedPurposeScreen.jsx";
import SharedWithCompaniesScreen from "../screens/sharedWithCompanyScreen/sharedWithCompanyScreen.jsx";
import SharedJurisdictionsScreen from "../screens/sharedJurisdictionsScreen/sharedJurisdictionsScreen.jsx";
import CompanyFilterScreen from "../screens/companyFilterScreen/companyFilterScreen.jsx";
import CompanySearchScreen from "../screens/companySearchScreen/companySearchScreen.jsx";
import DummyPopUp from "../dummyPopUp/dummyPopUp.jsx";
import CompanyInfoScreen from "../screens/companyInfoScreen/companyInfoScreen.jsx";
import makeExampleData from "../dataViz/makeExampleData.jsx";

// This is just a crutch until we have a proper callback for the info action
function alert(text) {
    const handlePopUpClose = () => {
        if (window.podNav) window.podNav.setActiveActions(["info", "search"]);
        ReactDOM.render(<PolyExplorer />, document.getElementById("feature"));
    };

    if (window.podNav) {
        window.podNav.actions.back = () => handlePopUpClose();
        window.podNav.setActiveActions(["back"]);
    }
    ReactDOM.render(
        <DummyPopUp text={text} onPopUpClose={handlePopUpClose} />,
        document.getElementById("feature")
    );
}

const PolyExplorer = () => {
    const [showScreen, setShowScreen] = useState("main");
    const [showFeatured, setShowFeatured] = useState(true);
    const [companyData] = useState(makeExampleData());
    const [selectedCompany, setSelectedCompany] = useState(undefined);
    const [featuredCompanyData] = useState(
        companyData.filter((e) => e.featured)
    );
    const [
        featuredCompanyTabInitialSlide,
        setFeaturedCompanyTabInitialSlide,
    ] = useState(0);

    const handleShowScreenChange = (showScreen, companyName) => {
        setShowScreen(showScreen);
        setSelectedCompany(
            companyData.filter((company) => companyName === company.name)[0]
        );
    };

    function updatePodNavigation() {
        const actions = {
            info: () => alert("Here be info!"),
            search: () => handleShowScreenChange("companySearchScreen"),
            back: () => handleShowScreenChange("main"),
        };

        if (window.podNav) {
            window.podNav.actions = actions;
            window.podNav.setActiveActions(
                showScreen === "main" ? ["info", "search"] : ["back"]
            );
        } else {
            // Fallback navigation for testing the feature outside the pod
            window.addEventListener("keyup", function ({ key }) {
                if (key === "Escape") actions.back();
                else if (key === "s") actions.search();
                else if (key === "i") actions.info();
            });
        }
    }

    const screens = {
        main: (
            <MainScreen
                handleShowScreenChange={handleShowScreenChange}
                featuredCompanyData={featuredCompanyData}
                companyData={companyData}
                showFeatured={showFeatured}
                setShowFeatured={setShowFeatured}
                featuredCompanyTabInitialSlide={featuredCompanyTabInitialSlide}
                setFeaturedCompanyTabInitialSlide={
                    setFeaturedCompanyTabInitialSlide
                }
            />
        ),
        dataTypes: <SharedDataTypeScreen company={selectedCompany} />,
        purposes: <SharedPurposeScreen company={selectedCompany} />,
        companies: <SharedWithCompaniesScreen company={selectedCompany} />,
        jurisdictions: <SharedJurisdictionsScreen company={selectedCompany} />,
        companyInfoScreen: <CompanyInfoScreen company={selectedCompany} />,
        companyFilterScreen: <CompanyFilterScreen companies={companyData} />,
        companySearchScreen: <CompanySearchScreen companies={companyData} />,
    };

    updatePodNavigation();
    return screens[showScreen];
};

export default PolyExplorer;
