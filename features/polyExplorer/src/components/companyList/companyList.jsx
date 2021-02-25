import React from "react";

import { applyFilters, displayString } from "../../companyFilter.js";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";

import "./companyList.css";

function groupCompanies(companies) {
    const sorted = companies.sort((a, b) => a.name.localeCompare(b.name));
    const groups = {};
    sorted.forEach((company) => {
        const key = company.name[0].toUpperCase();
        groups[key] = groups[key] || [];
        groups[key].push(company);
    });
    return groups;
}

const ActiveFilters = ({ activeFilters, onRemoveFilter }) => {
    const filterList = [];
    for (let [field, values] of Object.entries(activeFilters))
        for (let value of values) filterList.push([field, value]);
    return (
        <div className="active-filters">
            {filterList.map(([field, value], index) => (
                <button
                    key={index}
                    className={field}
                    onClick={() => onRemoveFilter(field, value)}
                    dangerouslySetInnerHTML={{
                        __html: displayString(field, value),
                    }}
                ></button>
            ))}
        </div>
    );
};

const CompanyList = ({
    companies,
    onShowScreenChange,
    activeFilters,
    onRemoveFilter,
}) => {
    const filteredCompanies = applyFilters(activeFilters, companies);
    const companyGroups = groupCompanies(filteredCompanies);
    return (
        <div className="company-list">
            <ActiveFilters
                activeFilters={activeFilters}
                onRemoveFilter={onRemoveFilter}
            />
            <button
                className="filter-button"
                onClick={() => onShowScreenChange("companyFilter")}
            ></button>
            {Object.entries(companyGroups).map(([label, companies], index) => (
                <div key={index} className="company-group">
                    <div className="company-group-label">{label}</div>
                    <div className="company-group-companies">
                        {companies.map((company, index) => (
                            <CompanyShortInfo
                                key={index}
                                company={company}
                                onShowScreenChange={onShowScreenChange}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CompanyList;
