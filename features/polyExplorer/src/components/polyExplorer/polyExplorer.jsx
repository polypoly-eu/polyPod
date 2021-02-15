import React, { useState } from "react";

import FeaturedCompanyHolder from "../featuredCompanyHolder/featuredCompanyHolder.jsx";
import CompanyList from "../companyList/companyList.jsx";
import SharedDataTypeScreen from "../screens/sharedDataTypeScreen/sharedDataTypeScreen.jsx";
import SharedPurposeScreen from "../screens/sharedPurposeScreen/sharedPurposeScreen.jsx";
import SharedWithCompaniesScreen from "../screens/sharedWithCompanyScreen/sharedWithCompanyScreen.jsx";
import SharedJurisdictionsScreen from "../screens/sharedJurisdictionsScreen/sharedJurisdictionsScreen.jsx";
import makeExampleData from "../dataViz/makeExampleData.jsx";
import "./polyExplorer.css";

const PolyExplorer = () => {
    const [showFeatured, setShowFeatured] = useState(true);
    const [showScreen, setShowScreen] = useState("start");
    const [selectedCompany, setSelectedCompany] = useState(undefined);
    const [companyData] = useState(makeExampleData());
    const [featuredCompanyData] = useState(
        companyData.filter((e) => e.featured)
    );

    const handleShowFeatureChange = (featured) => {
        setShowFeatured(featured);
    };

    const handleShowScreenChange = (showScreen, companyName) => {
        setShowScreen(showScreen);
        setSelectedCompany(companyName);
    };

    const getTabContent = () => {
        if (showFeatured)
            return (
                <FeaturedCompanyHolder
                    featuredCompanies={featuredCompanyData}
                    onShowScreenChange={handleShowScreenChange}
                />
            );
        return (
            <CompanyList
                companies={companyData}
                onShowScreenChange={handleShowScreenChange}
            />
        );
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
                        className="nav-button"
                        style={
                            showFeatured
                                ? { borderBottom: "4px solid white" }
                                : {}
                        }
                    >
                        Featured Companies
                    </button>
                    <button
                        onClick={() => handleShowFeatureChange(false)}
                        className="nav-button"
                        style={
                            showFeatured
                                ? {}
                                : { borderBottom: "4px solid white" }
                        }
                    >
                        All companies
                    </button>
                </div>
                {getTabContent()}
            </div>
        ),
        //better filter from identifier than name
        dataTypes: (
            <SharedDataTypeScreen
                company={
                    companyData.filter(
                        (company) => selectedCompany === company.name
                    )[0]
                }
                onShowScreenChange={handleShowScreenChange}
            />
        ),
        purposes: (
            <SharedPurposeScreen
                company={
                    companyData.filter(
                        (company) => selectedCompany === company.name
                    )[0]
                }
                onShowScreenChange={handleShowScreenChange}
            />
        ),
        companies: (
            <SharedWithCompaniesScreen
                company={
                    companyData.filter(
                        (company) => selectedCompany === company.name
                    )[0]
                }
                onShowScreenChange={handleShowScreenChange}
            />
        ),
        jurisdictions: (
            <SharedJurisdictionsScreen
                company={
                    companyData.filter(
                        (company) => selectedCompany === company.name
                    )[0]
                }
                onShowScreenChange={handleShowScreenChange}
            />
        ),
    };

    //polyExplorer "render"
    return getScreenContent();
};

export default PolyExplorer;
