import React, { useEffect, useRef, useState } from "react";

import i18n from "./i18n.js";
import { pod } from "./fakePod.js";
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
    const backStack = useRef([]).current;
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
    const initialDataExplorationSection = "dataTypes";
    const [dataExploringSection, setDataExploringSection] = useState(
        initialDataExplorationSection
    );
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeExplorationIndex, setActiveExplorationIndex] = useState(null);

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
        if (screen === "main") backStack.length = 0;
        else backStack.push(activeScreen);
        setActiveScreen(screen);
        if (companyName)
            setSelectedCompany(
                companyData.filter((company) => companyName === company.name)[0]
            );
    };

    const handleExplorationInfoScreen = (
        screen,
        activeSection,
        activeIndex,
        activeCategory
    ) => {
        handleActiveScreenChange(screen);
        setDataExploringSection(activeSection);
        setActiveExplorationIndex(activeIndex);
        if (activeCategory) setActiveCategory(activeCategory);
    };

    const handleRemoveFilter = (field, value) => {
        removeFilter(activeFilters, field, value);
        setActiveFilters({ ...activeFilters });
    };

    const handleFilterApply = (newActiveFilters) => {
        setActiveFilters(newActiveFilters);
        handleBack();
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
        if (activeScreen === "dataExploration") {
            setDataExploringSection(initialDataExplorationSection);
            setActiveCategory(null);
            setActiveExplorationIndex(null);
        }

        const previousScreen = backStack.pop();
        if (previousScreen) {
            setActiveScreen(previousScreen);
            return;
        }
        setActiveScreen("main");
    }

    function updatePodNavigation() {
        pod.polyNav.setTitle(i18n.t(`common:screenTitle.${activeScreen}`));
        pod.polyNav.actions = firstRun
            ? { info: () => {}, search: () => {} }
            : {
                  info: () => handleActiveScreenChange("info"),
                  search: () => handleActiveScreenChange("companySearch"),
                  back: handleBack,
              };
        pod.polyNav.setActiveActions(
            backStack.length ? ["back"] : ["info", "search"]
        );
    }

    useEffect(() => {
        updatePodNavigation();
        setTimeout(() => readFirstRun().then(setFirstRun), 300);
    });

    const screens = {
        main: (
            <MainScreen
                showFeatured={showFeatured}
                featuredCompanyData={featuredCompanyData}
                companyData={companyData}
                globalData={polyPediaGlobalData}
                onOpenDetails={(company) =>
                    handleActiveScreenChange("companyDetails", company)
                }
                onOpenFeaturedInfo={() =>
                    handleActiveScreenChange("featuredCompanyInfo")
                }
                onOpenFilters={() => handleActiveScreenChange("companyFilter")}
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
                startIndex={activeExplorationIndex}
                openMain={handleBack}
                openDataTypesInfo={(activeIndex) =>
                    handleExplorationInfoScreen(
                        "explorationDataTypesInfo",
                        "dataTypes",
                        activeIndex
                    )
                }
                openCategoryInfo={(activeIndex, activeCategory) =>
                    handleExplorationInfoScreen(
                        "explorationCategoryInfo",
                        "dataTypesCategory",
                        activeIndex,
                        activeCategory
                    )
                }
                openCorrelationInfo={(activeIndex) =>
                    handleExplorationInfoScreen(
                        "explorationCorrelationInfo",
                        "dataTypesCorrelation",
                        activeIndex
                    )
                }
                openPurposeInfo={(activeIndex) =>
                    handleExplorationInfoScreen(
                        "explorationPurposeInfo",
                        "purposes",
                        activeIndex
                    )
                }
                openCompaniesInfo={(activeIndex) =>
                    handleExplorationInfoScreen(
                        "explorationCompaniesInfo",
                        "companies",
                        activeIndex
                    )
                }
                openJurisdictionInfo={(activeIndex) =>
                    handleExplorationInfoScreen(
                        "explorationJurisdictionsInfo",
                        "jurisdictions",
                        activeIndex
                    )
                }
                maxCompanies={featuredCompanyMaxValues.companies}
                dataRecipients={selectedCompany?.dataRecipients?.map((name) =>
                    companyData.find(
                        (company) =>
                            company.name.toLowerCase() === name.toLowerCase()
                    )
                )}
                onOpenRegionInfo={(activeIndex) =>
                    handleExplorationInfoScreen(
                        "explorationJurisdictionsInfo",
                        "jurisdictions",
                        activeIndex
                    )
                }
                onOpenDetails={(company) =>
                    handleActiveScreenChange("companyDetails", company)
                }
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
        featuredCompanyInfo: <FeaturedCompanyInfoScreen onClose={handleBack} />,
        companySearch: (
            <CompanySearchScreen
                companies={companyData}
                onOpenDetails={(companyName) =>
                    handleActiveScreenChange("companyDetails", companyName)
                }
            />
        ),
        info: <InfoScreen onClose={handleBack} />,
        dataRegionInfo: <DataRegionInfoScreen onClose={handleBack} />,
        explorationDataTypesInfo: <DataTypesInfoScreen onClose={handleBack} />,
        explorationCategoryInfo: (
            <CategoryInfoScreen
                category={activeCategory}
                company={selectedCompany}
                onClose={handleBack}
            />
        ),
        explorationCorrelationInfo: (
            <CorrelationInfoScreen
                company={selectedCompany}
                onClose={handleBack}
            />
        ),
        explorationPurposeInfo: <PurposeInfoScreen onClose={handleBack} />,
        explorationCompaniesInfo: <CompaniesInfoScreen onClose={handleBack} />,
        explorationJurisdictionsInfo: (
            <JurisdictionInfoScreen onClose={handleBack} />
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
