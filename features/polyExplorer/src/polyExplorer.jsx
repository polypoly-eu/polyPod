import React, { useState } from "react";

import i18n from "./i18n.js";
import { pod, podNav } from "./fakePod.js";
import { emptyFilters, removeFilter } from "./companyFilter.js";

import MainScreen from "./screens/main/main.jsx";
import DataExplorationScreen from "./screens/dataExploration/dataExploration.jsx";
import CompanyFilterScreen from "./screens/companyFilter/companyFilter.jsx";
import CompanySearchScreen from "./screens/companySearch/companySearch.jsx";
import InfoScreen from "./screens/info/info.jsx";
import CompanyInfoScreen from "./screens/companyInfo/companyInfo.jsx";
import DataRegionInfoScreen from "./screens/dataRegionInfo/dataRegionInfo.jsx";
import FeaturedCompanyHelpScreen from "./screens/featuredCompanyHelp/featuredCompanyHelp.jsx";
import OnboardingPopup from "./components/onboardingPopup/onboardingPopup.jsx";
import ConstructionPopup from "./components/constructionPopup/constructionPopup.jsx";

import polyPediaCompanies from "./data/companies.json";
import polyPediaGlobalData from "./data/global.json";

const namespace = "http://polypoly.coop/schema/polyExplorer/#";

async function readFirstRun() {
    const quads = await pod.polyIn.select({});
    return !quads.some(
        ({ subject, predicate, object }) =>
            subject.value === `${namespace}polyExplorer` &&
            predicate.value === `${namespace}firstRun` &&
            object.value === `${namespace}false`
    );
}

async function writeFirstRun(firstRun) {
    const { dataFactory, polyIn } = pod;
    const quad = dataFactory.quad(
        dataFactory.namedNode(`${namespace}polyExplorer`),
        dataFactory.namedNode(`${namespace}firstRun`),
        dataFactory.namedNode(`${namespace}${firstRun}`)
    );
    polyIn.add(quad);
}

const PolyExplorer = () => {
    const [activeScreen, setActiveScreen] = useState("main");
    const [showFeatured, setShowFeatured] = useState(true);
    const [companyData] = useState(polyPediaCompanies);
    const [selectedCompany, setSelectedCompany] = useState(undefined);
    const featuredCompanyData = companyData.filter(
        (company) => company.featured == true
    );
    const [
        featuredCompanyTabInitialSlide,
        setFeaturedCompanyTabInitialSlide,
    ] = useState(0);

    const [activeFilters, setActiveFilters] = useState(emptyFilters());
    const [firstRun, setFirstRun] = useState(false);
    const [showConstructionPopup, setShowConstructionPopUp] = useState(false);

    const handleActiveScreenChange = (screen, companyName) => {
        setActiveScreen(screen);
        if (companyName)
            setSelectedCompany(
                companyData.filter((company) => companyName === company.name)[0]
            );
    };

    const handleRemoveFilter = (field, value) => {
        removeFilter(activeFilters, field, value);
        setActiveFilters({ ...activeFilters });
    };

    const handleFilterApply = (newActiveFilters) => {
        setActiveFilters(newActiveFilters);
        handleActiveScreenChange("main");
    };

    function handleOnboardingPopupClose() {
        setFirstRun(false);
        writeFirstRun(false);
    }

    function handleOnboardingPopupMoreInfo() {
        handleOnboardingPopupClose();
        handleActiveScreenChange("info");
    }

    function updatePodNavigation() {
        podNav.setTitle(i18n.t(`common:screenTitle.${activeScreen}`));
        podNav.actions = {
            info: () => handleActiveScreenChange("info"),
            search: () => handleActiveScreenChange("companySearch"),
            back: () => {
                if (activeScreen === "dataRegionInfo") {
                    handleActiveScreenChange("companyInfo");
                    return;
                }

                handleActiveScreenChange("main");
            },
        };
        podNav.setActiveActions(
            activeScreen === "main" ? ["info", "search"] : ["back"]
        );
    }

    updatePodNavigation();
    setTimeout(() => readFirstRun().then(setFirstRun), 300);

    const screens = {
        main: (
            <MainScreen
                showFeatured={showFeatured}
                featuredCompanyData={featuredCompanyData}
                companyData={companyData}
                globalData={polyPediaGlobalData}
                onActiveScreenChange={handleActiveScreenChange}
                onShowFeaturedChange={setShowFeatured}
                featuredCompanyTabInitialSlide={featuredCompanyTabInitialSlide}
                onFeaturedCompanyTabInitialSlideChange={
                    setFeaturedCompanyTabInitialSlide
                }
                activeFilters={activeFilters}
                onRemoveFilter={handleRemoveFilter}
            />
        ),
        dataExploration: <DataExplorationScreen company={selectedCompany} />,
        companyInfo: (
            <CompanyInfoScreen
                company={selectedCompany}
                onOpenRegionInfo={() =>
                    handleActiveScreenChange("dataRegionInfo")
                }
                onOpenExploration={(companyName) =>
                    handleActiveScreenChange("dataExploration", companyName)
                }
            />
        ),
        companyFilter: (
            <CompanyFilterScreen
                companies={companyData}
                globalData={polyPediaGlobalData}
                activeFilters={activeFilters}
                onApply={handleFilterApply}
            />
        ),
        featuredCompanyHelp: (
            <FeaturedCompanyHelpScreen onClose={podNav.actions.back} />
        ),
        companySearch: (
            <CompanySearchScreen
                companies={companyData}
                onOpenInfo={(companyName) =>
                    handleActiveScreenChange("companyInfo", companyName)
                }
            />
        ),
        info: <InfoScreen onClose={podNav.actions.back} />,
        dataRegionInfo: <DataRegionInfoScreen onClose={podNav.actions.back} />,
    };

    return (
        <div className="poly-explorer">
            {screens[activeScreen]}{" "}
            {firstRun ? (
                <OnboardingPopup
                    onClose={handleOnboardingPopupClose}
                    onMoreInfo={handleOnboardingPopupMoreInfo}
                />
            ) : null}
            {showConstructionPopup ? (
                <ConstructionPopup
                    onClose={() => setShowConstructionPopUp(false)}
                />
            ) : null}
        </div>
    );
};

export default PolyExplorer;
