import React, { useState, useEffect, useRef } from "react";

import i18n from "../../i18n.js";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";
import InfiniteScroll from "react-infinite-scroll-component";

import "./companyList.css";

function groupCompanies(companies) {
    const sorted = companies.sort((a, b) => a.compareNames(b));
    const groups = {};
    sorted.forEach((company) => {
        const key = company.nameIndexCharacter.toUpperCase();
        groups[key] = groups[key] || [];
        groups[key].push(company);
    });
    return groups;
}

const ActiveFilters = ({ activeFilters, globalData, onRemoveFilter }) => {
    const filterList = [];
    for (let field of activeFilters.fields)
        for (let value of activeFilters.sortedValues(field, i18n, globalData))
            filterList.push([field, value]);
    return (
        <div className="active-filters">
            {filterList.map(([field, value], index) => (
                <button
                    key={index}
                    className={field}
                    onClick={() => onRemoveFilter(field, value)}
                    dangerouslySetInnerHTML={{
                        __html: activeFilters.displayString(
                            field,
                            value,
                            i18n,
                            globalData
                        ),
                    }}
                ></button>
            ))}
        </div>
    );
};

//number of groups needed to fill first screen
function getStartGroups(companyGroups) {
    let numberGroups = 0;
    let numberValues = 0;
    const keys = Object.keys(companyGroups);
    for (let e of keys) {
        numberGroups++;
        numberValues += companyGroups[e].length;
        if (numberValues > 15) return keys[numberGroups];
    }
    return keys.pop();
}

const CompanyList = ({
    companies,
    globalData,
    onOpenFilters,
    onOpenDetails,
    activeFilters,
    onRemoveFilter,
}) => {
    const filteredCompanies = activeFilters.apply(companies);
    const companyGroups = groupCompanies(filteredCompanies);
    const allKeys = Object.keys(companyGroups);
    const [loadedCompanies, setLoadedCompanies] = useState({});
    const [toLoadKeys, setToLoadKeys] = useState(allKeys);
    const [hasMore, setHasMore] = useState(true);
    const listRef = useRef();

    const handleLoadMoreData = () => {
        if (toLoadKeys.length > 0) {
            const moreCompanies = { ...loadedCompanies };
            const loadKeys = [...toLoadKeys];
            const newKey = loadKeys.shift();
            moreCompanies[newKey] = companyGroups[newKey];
            setToLoadKeys(loadKeys);
            setLoadedCompanies(moreCompanies);
        } else setHasMore(false);
    };

    const handleRemoveFilter = (field, value) => {
        onRemoveFilter(field, value);
        const newLoadedCompanies = {};
        const filteredCompanies = activeFilters.apply(companies);
        const newCompanyGroups = groupCompanies(filteredCompanies);
        const newKeys = Object.keys(newCompanyGroups);
        const newStartGroups = getStartGroups(newCompanyGroups);
        for (
            let i = 0;
            i <= Object.keys(newCompanyGroups).indexOf(newStartGroups);
            i++
        ) {
            newLoadedCompanies[newKeys[i]] = newCompanyGroups[newKeys[i]];
        }
        setLoadedCompanies(newLoadedCompanies);
        const toLoadKeys = [...newKeys];
        toLoadKeys.splice(0, newKeys.indexOf(newStartGroups));
        setToLoadKeys(toLoadKeys);
        listRef.current.scrollTop = 0;
    };

    useEffect(() => {
        const loadedCompanies = {};
        const startGroups = getStartGroups(companyGroups);
        for (let i = 0; i <= allKeys.indexOf(startGroups); i++) {
            loadedCompanies[allKeys[i]] = companyGroups[allKeys[i]];
        }
        setLoadedCompanies(loadedCompanies);
        const toLoadKeys = [...allKeys];
        toLoadKeys.splice(0, allKeys.indexOf(startGroups));
        setToLoadKeys(toLoadKeys);
    }, []);

    return (
        <div id="company-list" className="company-list" ref={listRef}>
            <ActiveFilters
                activeFilters={activeFilters}
                globalData={globalData}
                onRemoveFilter={handleRemoveFilter}
            />
            <div
                className={
                    "companies" +
                    (activeFilters.empty ? "" : " filters-visible")
                }
            >
                <button
                    className="filter-button"
                    onClick={onOpenFilters}
                ></button>
                <InfiniteScroll
                    dataLength={allKeys.length - toLoadKeys.length}
                    next={handleLoadMoreData}
                    scrollThreshold="80%"
                    hasMore={hasMore}
                    scrollableTarget="company-list"
                >
                    {Object.entries(loadedCompanies).map(
                        ([label, companies], index) => (
                            <div key={index} className="company-group">
                                <div className="company-group-label">
                                    {label}
                                </div>
                                <div className="company-group-companies">
                                    {companies.map((company, index) => (
                                        <CompanyShortInfo
                                            key={index}
                                            company={company}
                                            onOpenDetails={onOpenDetails}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default CompanyList;
