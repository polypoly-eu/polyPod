import React, { useContext, useEffect, useState } from "react";
import { pod } from "../fakePod.js";
import { useHistory, useLocation } from "react-router";
import i18n from "../i18n.js";

//model
import { Company } from "../model/company.js";
import { CompanyFilter } from "../model/companyFilter.js";

//local-data imports
import polyPediaCompanies from "../data/companies.json";
import polyPediaGlobalData from "../data/global.json";

//constants
const namespace = "http://polypoly.coop/schema/polyExplorer/#";

export const ExplorerContext = React.createContext();

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
    //state
    const [firstRun, setFirstRun] = useState(false);
    const [companies] = useState(
        loadCompanies(polyPediaCompanies, polyPediaGlobalData)
    );
    const featuredCompanies = Object.values(companies).filter(
        (company) => company.featured
    );
    const [selectedCompany, setSelectedCompany] = useState(undefined);
    const [activeFilters, setActiveFilters] = useState(new CompanyFilter());

    //mainscreen tabs
    const [showClusters, setShowClusters] = useState(true);

    //router hooks
    const history = useHistory();
    const location = useLocation();

    function handleBack() {
        if (location.pathname != "/") history.goBack();
    }

    function handleOnboardingPopupClose() {
        setFirstRun(false);
        writeFirstRun(false);
    }

    function handleOnboardingPopupMoreInfo() {
        handleOnboardingPopupClose();
        handleActiveScreenChange("info");
    }

    function updatePodNavigation() {
        if (
            location.pathname == "/data-exploration" ||
            location.pathname == "/company-details"
        )
            pod.polyNav.setTitle(companies[selectedCompany].name);
        else
            pod.polyNav.setTitle(
                i18n.t(`common:screenTitle.${location.pathname}`)
            );
        pod.polyNav.actions = firstRun
            ? { info: () => {}, search: () => {} }
            : {
                  info: () => history.push("/info"),
                  search: () => history.push("/search"),
                  back: handleBack,
              };
        pod.polyNav.setActiveActions(
            history.length ? ["back"] : ["info", "search"]
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

    //on-startup
    useEffect(() => {
        setTimeout(() => readFirstRun().then(setFirstRun), 300);
    }, []);

    //on-change
    useEffect(() => {
        updatePodNavigation();
    });

    return (
        <ExplorerContext.Provider
            value={{
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
                activeFilters,
                handleRemoveFilter,
                handleFilterApply,
                showClusters,
                setShowClusters,
            }}
        >
            {children}
        </ExplorerContext.Provider>
    );
};
