import React, { useState } from "react";

import i18n from "./i18n.js";
import { pod, podNav } from "./fakePod.js";
import { emptyFilters, removeFilter } from "./companyFilter.js";

import MainScreen from "./screens/main/main.jsx";
import DataExplorationScreen from "./screens/dataExploration/dataExploration.jsx";
import CompanyFilterScreen from "./screens/companyFilter/companyFilter.jsx";
import CompanySearchScreen from "./screens/companySearch/companySearch.jsx";
import InfoScreen from "./screens/info/info.jsx";
import CompanyDetailsScreen from "./screens/companyDetails/companyDetails.jsx";
import DataRegionInfoScreen from "./screens/dataRegionInfo/dataRegionInfo.jsx";
import DataTypesInfoScreen from "./screens/explorationInfo/dataTypesInfo/dataTypesInfo.jsx";
import CategoryInfoScreen from "./screens/explorationInfo/categoryInfo/categoryInfo.jsx";
import CorrelationInfoScreen from "./screens/explorationInfo/correlationInfo/correlationInfo.jsx";
import PurposeInfoScreen from "./screens/explorationInfo/purposeInfo/purposeInfo.jsx";
import CompaniesInfoScreen from "./screens/explorationInfo/companiesInfo/companiesInfo.jsx";
import JurisdictionInfoScreen from "./screens/explorationInfo/jurisdictionInfo/jurisdictionInfo.jsx";
import FeaturedCompanyInfoScreen from "./screens/featuredCompanyInfo/featuredCompanyInfo.jsx";
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
    const initialDataExplorationSection = "construction";
    const [dataExploringSection, setDataExploringSection] = useState(
        initialDataExplorationSection
    );

    //Get the max values of all featured companies
    function calculateAverage(values) {
        const average = values.reduce((a, b) => a + b, 0) / values.length;
        return Math.round(10 * average) / 10;
    }
    const counts = {
        dataTypes: featuredCompanyData.map(
            (company) => company.dataTypesShared.length
        ),
        purposes: featuredCompanyData.map(
            (company) => company.dataSharingPurposes.length
        ),
        companies: featuredCompanyData.map(
            (company) => company.dataRecipients.length
        ),
        jurisdictions: featuredCompanyData.map((company) =>
            company.jurisdictionsShared
                ? company.jurisdictionsShared.children.length
                : 0
        ),
    };
    const featuredCompanyMaxValues = Object.fromEntries(
        Object.entries(counts).map(([key, value]) => [key, Math.max(...value)])
    );
    const featuredCompanyAverageValues = Object.fromEntries(
        Object.entries(counts).map(([key, value]) => [
            key,
            calculateAverage(value),
        ])
    );

    const handleActiveScreenChange = (screen, companyName) => {
        setActiveScreen(screen);
        if (companyName)
            setSelectedCompany(
                companyData.filter((company) => companyName === company.name)[0]
            );
    };

    const handleExplorationInfoScreen = (screen, activeSection) => {
        setActiveScreen(screen);
        setDataExploringSection(activeSection);
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

    const handleOpenDataExplorationSection = (section, company) => {
        setDataExploringSection(section);
        handleActiveScreenChange("dataExploration", company);
    };

    function handleBack() {
        if (activeScreen === "dataRegionInfo") {
            handleActiveScreenChange("companyDetails");
            return;
        }

        if (/^exploration.*Info$/.test(activeScreen)) {
            handleActiveScreenChange("dataExploration");
            return;
        }

        if (activeScreen === "dataExploration")
            setDataExploringSection(initialDataExplorationSection);

        handleActiveScreenChange("main");
    }

    function updatePodNavigation() {
        podNav.setTitle(i18n.t(`common:screenTitle.${activeScreen}`));
        podNav.actions = {
            info: () => handleActiveScreenChange("info"),
            search: () => handleActiveScreenChange("companySearch"),
            back: handleBack,
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
                featuredCompanyMaxValues={featuredCompanyMaxValues}
                featuredCompanyAverageValues={featuredCompanyAverageValues}
                onOpenDataExplorationSection={handleOpenDataExplorationSection}
            />
        ),
        dataExploration: (
            <DataExplorationScreen
                company={selectedCompany}
                startSection={dataExploringSection}
                openDataTypesInfo={() =>
                    handleExplorationInfoScreen(
                        "explorationDataTypesInfo",
                        "dataTypes"
                    )
                }
                openCategoryInfo={() =>
                    handleExplorationInfoScreen(
                        "explorationCategoryInfo",
                        "dataTypesCategory"
                    )
                }
                openCorrelationInfo={() =>
                    handleExplorationInfoScreen(
                        "explorationCorrelationInfo",
                        "dataTypesCorrelation"
                    )
                }
                openPurposeInfo={() =>
                    handleExplorationInfoScreen(
                        "explorationPurposeInfo",
                        "purposes"
                    )
                }
                openCompaniesInfo={() =>
                    handleExplorationInfoScreen(
                        "explorationCompaniesInfo",
                        "companies"
                    )
                }
                openJurisdictionInfo={() =>
                    handleExplorationInfoScreen(
                        "explorationJurisdictionsInfo",
                        "jurisdictions"
                    )
                }
                maxCompanies={featuredCompanyMaxValues.companies}
                dataRecipients={selectedCompany?.dataRecipients?.map((name) =>
                    companyData.find(
                        (company) =>
                            company.name.toLowerCase() === name.toLowerCase()
                    )
                )}
            />
        ),
        companyDetails: (
            <CompanyDetailsScreen
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
        featuredCompanyInfo: (
            <FeaturedCompanyInfoScreen onClose={podNav.actions.back} />
        ),
        companySearch: (
            <CompanySearchScreen
                companies={companyData}
                onOpenInfo={(companyName) =>
                    handleActiveScreenChange("companyDetails", companyName)
                }
            />
        ),
        info: <InfoScreen onClose={podNav.actions.back} />,
        dataRegionInfo: <DataRegionInfoScreen onClose={podNav.actions.back} />,
        explorationDataTypesInfo: (
            <DataTypesInfoScreen onClose={podNav.actions.back} />
        ),
        explorationCategoryInfo: (
            <CategoryInfoScreen onClose={podNav.actions.back} />
        ),
        explorationCorrelationInfo: (
            <CorrelationInfoScreen onClose={podNav.actions.back} />
        ),
        explorationPurposeInfo: (
            <PurposeInfoScreen onClose={podNav.actions.back} />
        ),
        explorationCompaniesInfo: (
            <CompaniesInfoScreen onClose={podNav.actions.back} />
        ),
        explorationJurisdictionsInfo: (
            <JurisdictionInfoScreen onClose={podNav.actions.back} />
        ),
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
