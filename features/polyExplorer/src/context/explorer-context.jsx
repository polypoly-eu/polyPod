import React, { useEffect, useState } from "react";
import { pod } from "../fakePod.js";
import { useHistory, useLocation } from "react-router";
import i18n from "../i18n.js";

//model
import { Company } from "../model/company.js";
import { CompanyFilter } from "../model/companyFilter.js";

//local-data imports
import polyPediaCompanies from "../data/companies.json";
import globalData from "../data/global.json";

export const ExplorerContext = React.createContext();

//storage
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

export const ExplorerProvider = ({ children }) => {
    const [navigationState, setNavigationState] = useState({
        firstRun: false,
        showClusters: true,
    });

    //constants
    const companies = loadCompanies(polyPediaCompanies, globalData);
    const companiesList = Object.values(companies);
    const featuredCompanies = Object.values(companies).filter(
        (company) => company.featured
    );

    const [selectedCompany, setSelectedCompany] = useState(null);
    const [storedCompanies, setStoredCompanies] = useState([]);
    const selectedCompanyObject = companies[selectedCompany];

    const [activeFilters, setActiveFilters] = useState(new CompanyFilter());

    //remember data-exploration state
    const initialDataExplorationSection = "dataTypes"; // to go
    const [dataExploringSection, setDataExploringSection] = useState(
        initialDataExplorationSection
    );
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeExplorationIndex, setActiveExplorationIndex] = useState(null);

    //router hooks
    const history = useHistory();
    const location = useLocation();
    const currentPath = location.pathname;

    const dataRecipients = companies[selectedCompany]?.dataRecipients?.map(
        (ppid) => companies[ppid]
    );

    //change the navigationState like so: changeNavigationState({<changedState>:<changedState>})
    function changeNavigationState(changedState) {
        setNavigationState({ ...navigationState, ...changedState });
    }

    function handleBack() {
        if (currentPath == "/data-exploration") setActiveExplorationIndex(null);
        if (currentPath == "/company-details") {
            const previousCompany = storedCompanies.pop();
            setStoredCompanies(storedCompanies);
            if (previousCompany) setSelectedCompany(previousCompany);
        }
        if (currentPath != "/") history.goBack();
    }

    function handleSelectCompany(ppid, activeExplorationIndex) {
        if (currentPath != "/" && selectedCompany) {
            storedCompanies.push(selectedCompany);
            setStoredCompanies(storedCompanies);
        }
        setSelectedCompany(ppid);
    }

    function handleOnboardingPopupClose() {
        changeNavigationState({ firstRun: false });
        writeFirstRun(false);
    }

    function handleOnboardingPopupMoreInfo() {
        handleOnboardingPopupClose();
        history.push("/info");
    }

    function updatePodNavigation() {
        if (
            currentPath == "/data-exploration" ||
            currentPath == "/company-details"
        )
            pod.polyNav.setTitle(companies[selectedCompany].name);
        else pod.polyNav.setTitle(i18n.t(`common:screenTitle.${currentPath}`));
        pod.polyNav.actions = navigationState.firstRun
            ? {
                  info: () => {},
                  search: () => {},
              }
            : {
                  info: () => history.push("/info"),
                  search: () => history.push("/search"),
                  back: handleBack,
              };
        pod.polyNav.setActiveActions(
            currentPath == "/" ? ["info", "search"] : ["back"]
        );
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

    //Get the max values of all featured companies
    function calculateAverage(values) {
        const average = values.reduce((a, b) => a + b, 0) / values.length;
        return Math.round(10 * average) / 10;
    }

    const featuredCompanyMaxValues = Object.fromEntries(
        Object.entries(counts).map(([key, value]) => [key, Math.max(...value)])
    );

    const featuredCompanyAverageValues = Object.fromEntries(
        Object.entries(counts).map(([key, value]) => [
            key,
            calculateAverage(value),
        ])
    );

    const handleRemoveFilter = (field, value) => {
        activeFilters.remove(field, value);
        setActiveFilters(activeFilters.copy());
    };

    const handleFilterApply = (newActiveFilters) => {
        setActiveFilters(newActiveFilters);
    };

    const handleExplorationInfoScreen = (
        activeSection,
        activeIndex,
        activeCategory
    ) => {
        setDataExploringSection(activeSection);
        setActiveExplorationIndex(activeIndex);
        if (activeCategory) setActiveCategory(activeCategory);
    };

    const handleOpenDataExplorationSection = (section) => {
        setDataExploringSection(section);
        history.push("/data-exploration");
    };

    //on-startup
    useEffect(() => {
        setTimeout(
            () =>
                readFirstRun().then((firstRun) =>
                    changeNavigationState({
                        firstRun: firstRun,
                    })
                ),
            300
        );
    }, []);

    //on-change
    useEffect(() => {
        updatePodNavigation();
    });

    return (
        <ExplorerContext.Provider
            value={{
                navigationState,
                changeNavigationState,
                handleOnboardingPopupClose,
                handleOnboardingPopupMoreInfo,
                handleBack,
                companies,
                companiesList,
                featuredCompanies,
                selectedCompany,
                setSelectedCompany,
                selectedCompanyObject,
                dataRecipients,
                globalData,
                featuredCompanyMaxValues,
                featuredCompanyAverageValues,
                activeFilters,
                handleRemoveFilter,
                handleFilterApply,
                dataExploringSection,
                activeCategory,
                activeExplorationIndex,
                handleExplorationInfoScreen,
                handleOpenDataExplorationSection,
                setActiveExplorationIndex,
            }}
        >
            {children}
        </ExplorerContext.Provider>
    );
};
