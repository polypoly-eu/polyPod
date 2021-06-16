import React, { useEffect, useRef, useState, useContext } from "react";

import { CompanyFilter } from "./model/companyFilter.js";
import polyPediaGlobalData from "./data/global.json";

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

import {
    ExplorerProvider,
    ExplorerContext,
} from "./context/explorer-context.jsx";

const PolyExplorerApp = () => {
    const [showClusters, setShowClusters] = useState(true);

    const [activeFilters, setActiveFilters] = useState(new CompanyFilter());
    const initialDataExplorationSection = "dataTypes";
    const [dataExploringSection, setDataExploringSection] = useState(
        initialDataExplorationSection
    );
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeExplorationIndex, setActiveExplorationIndex] = useState(null);

    const {
        firstRun,
        handleOnboardingPopupClose,
        handleOnboardingPopupMoreInfo,
        handleBack,
        companies,
        featuredCompanies,
        selectedCompany,
        setSelectedCompany,
        featuredCompanyMaxValues,
        featuredCompanyAverageValues,
    } = useContext(ExplorerContext);

    const handleActiveScreenChange = (screen, ppid) => {
        if (ppid) setSelectedCompany(ppid);
    };

    const handleExplorationInfoScreen = (
        screen,
        activeSection,
        activeIndex,
        activeCategory
    ) => {
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

    const handleOpenDataExplorationSection = (section, company) => {
        setDataExploringSection(section);
        handleActiveScreenChange("dataExploration", company);
    };

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
            {firstRun ? (
                <OnboardingPopup
                    onClose={handleOnboardingPopupClose}
                    onMoreInfo={handleOnboardingPopupMoreInfo}
                />
            ) : null}
        </div>
    );
};

const PolyExplorer = () => {
    //global history object
    const history = useHistory();

    return (
        <Router history={history}>
            <ExplorerProvider>
                <PolyExplorerApp />
            </ExplorerProvider>
        </Router>
    );
};

export default PolyExplorer;
