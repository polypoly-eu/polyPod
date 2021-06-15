import React, { useEffect, useRef, useState } from "react";

import i18n from "./i18n.js";
import { pod } from "./fakePod.js";
import { Company } from "./model/company.js";
import { CompanyFilter } from "./model/companyFilter.js";

import MainScreen from "./screens/main/main.jsx";
import DataExplorationScreen from "./screens/dataExploration/dataExploration.jsx";
import CompanyFilterScreen from "./screens/companyFilter/companyFilter.jsx";
import CompanySearchScreen from "./screens/companySearch/companySearch.jsx";
import InfoScreen from "./screens/info/info.jsx";
import {
    HashRouter as Router,
    Switch,
    Route,
    Redirect,
    useHistory,
    useLocation,
} from "react-router-dom";
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

function loadCompanies(JSONData, globalData) {
    const companies = {};
    for (let obj of JSONData) {
        companies[obj.ppid] = new Company(obj, globalData);
    }
    return companies;
}

const PolyExplorerApp = () => {
    const [activeScreen, setActiveScreen] = useState("main");
    const backStack = useRef([]).current;
    const [showClusters, setShowClusters] = useState(true);
    const [companies] = useState(
        loadCompanies(polyPediaCompanies, polyPediaGlobalData)
    );
    const featuredCompanies = Object.values(companies).filter(
        (company) => company.featured
    );
    const [selectedCompany, setSelectedCompany] = useState(undefined);

    const [activeFilters, setActiveFilters] = useState(new CompanyFilter());
    const [firstRun, setFirstRun] = useState(false);
    const initialDataExplorationSection = "dataTypes";
    const [dataExploringSection, setDataExploringSection] = useState(
        initialDataExplorationSection
    );
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeExplorationIndex, setActiveExplorationIndex] = useState(null);

    //Router hooks
    const history = useHistory();
    const location = useLocation();

    //Get the max values of all featured companies
    function calculateAverage(values) {
        const average = values.reduce((a, b) => a + b, 0) / values.length;
        return Math.round(10 * average) / 10;
    }
    const counts = {
        dataTypes: Object.values(featuredCompanies).map(
            (company) => company.dataTypesShared.length
        ),
        purposes: Object.values(featuredCompanies).map(
            (company) => company.dataSharingPurposes.length
        ),
        companies: Object.values(featuredCompanies).map(
            (company) => company.dataRecipients.length
        ),
        jurisdictions: Object.values(featuredCompanies).map(
            (company) => company.jurisdictionsShared.children.length
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

    const handleActiveScreenChange = (screen, ppid) => {
        if (screen === "main") backStack.length = 0;
        else backStack.push(activeScreen);
        setActiveScreen(screen);
        if (ppid) setSelectedCompany(ppid);
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
        activeFilters.remove(field, value);
        setActiveFilters(activeFilters.copy());
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
        history.goBack();
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
        if (
            location.pathname == "/data-exploration" ||
            location.pathname == "/company-details"
        )
            pod.polyNav.setTitle(companies[selectedCompany].name);
        else pod.polyNav.setTitle(i18n.t(`common:screenTitle.${activeScreen}`));
        pod.polyNav.actions = firstRun
            ? { info: () => {}, search: () => {} }
            : {
                  info: () => history.push("/info"),
                  search: () => history.push("/search"),
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

    return (
        <div className="poly-explorer">
            <Switch>
                <Route exact path="/">
                    <MainScreen
                        showClusters={showClusters}
                        companies={companies}
                        globalData={polyPediaGlobalData}
                        onOpenDetails={(company) =>
                            handleActiveScreenChange("companyDetails", company)
                        }
                        onOpenFilters={() =>
                            handleActiveScreenChange("companyFilter")
                        }
                        onShowClustersChange={setShowClusters}
                        activeFilters={activeFilters}
                        onRemoveFilter={handleRemoveFilter}
                    />
                    {firstRun ? (
                        <OnboardingPopup
                            onClose={handleOnboardingPopupClose}
                            onMoreInfo={handleOnboardingPopupMoreInfo}
                        />
                    ) : null}
                </Route>
                <Route exact path="/company-details">
                    <CompanyDetailsScreen
                        company={companies[selectedCompany]}
                        onOpenRegionInfo={() =>
                            handleActiveScreenChange("dataRegionInfo")
                        }
                        featuredCompanyMaxValues={featuredCompanyMaxValues}
                        featuredCompanyAverageValues={
                            featuredCompanyAverageValues
                        }
                        onOpenDataExplorationSection={
                            handleOpenDataExplorationSection
                        }
                    />
                </Route>
                <Route exact path="/data-exploration">
                    <DataExplorationScreen
                        company={companies[selectedCompany]}
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
                        dataRecipients={companies[
                            selectedCompany
                        ]?.dataRecipients?.map((ppid) => companies[ppid])}
                        onOpenRegionInfo={(activeIndex) =>
                            handleExplorationInfoScreen(
                                "explorationJurisdictionsInfo",
                                "jurisdictions",
                                activeIndex
                            )
                        }
                    />
                </Route>
                <Route exact path="/company-filters">
                    <CompanyFilterScreen
                        companies={companies}
                        globalData={polyPediaGlobalData}
                        activeFilters={activeFilters}
                        onApply={handleFilterApply}
                    />
                </Route>
                <Route exact path="/search">
                    <CompanySearchScreen
                        companies={Object.values(companies)}
                        onOpenDetails={(ppid) =>
                            handleActiveScreenChange("companyDetails", ppid)
                        }
                    />
                </Route>
                <Route exact path="/featured-company-info">
                    <FeaturedCompanyInfoScreen onClose={handleBack} />
                </Route>
                <Route exact path="/info">
                    <InfoScreen onClose={handleBack} />
                </Route>
                <Route exact path="/data-region-info">
                    <DataRegionInfoScreen onClose={handleBack} />
                </Route>
                <Route exact path="/data-types-info">
                    <DataTypesInfoScreen onClose={handleBack} />
                </Route>
                <Route exact path="/data-category-info">
                    <CategoryInfoScreen
                        category={activeCategory}
                        company={companies[selectedCompany]}
                        onClose={handleBack}
                    />
                </Route>
                <Route exact path="/data-correlation-info">
                    <CorrelationInfoScreen
                        company={companies[selectedCompany]}
                        onClose={handleBack}
                    />
                </Route>
                <Route exact path="/purpose-info">
                    <PurposeInfoScreen onClose={handleBack} />
                </Route>
                <Route exact path="/companies-info">
                    <CompaniesInfoScreen onClose={handleBack} />
                </Route>
                <Route exact path="/jurisdiction-info">
                    <JurisdictionInfoScreen onClose={handleBack} />
                </Route>
            </Switch>
        </div>
    );
};

const PolyExplorer = () => {
    const history = useHistory();
    return (
        <Router history={history}>
            <PolyExplorerApp />
        </Router>
    );
};

export default PolyExplorer;
