import React from "react";
import "./featuredCompany.css";

const FeaturedCompany = ({ company, onShowScreenChange }) => {
    const getContentButtons = () => {
        if (company.jurisdictions === undefined)
            return (
                <div className="featured-content-button-holder">
                    <button className="featured-content-button data-shared">
                        shares {company.dataTypesShared.length} datatypes
                    </button>
                    <button className="featured-content-button purpose-shared">
                        for {company.dataSharingPurposes.length} purposes
                    </button>
                    <button className="featured-content-button companies-shared">
                        with {company.sharedWithCompanies.length} companies
                    </button>
                    <button className="featured-content-button jurisdictions-shared">
                        in X jurisdictions
                    </button>
                </div>
            );
        return (
            <div className="featured-content-button-holder">
                <button
                    onClick={() =>
                        onShowScreenChange("dataTypes", company.name)
                    }
                    className="featured-content-button data-shared"
                >
                    shares {company.dataTypesShared.length} datatypes
                </button>
                <button
                    onClick={() => onShowScreenChange("purposes", company.name)}
                    className="featured-content-button purpose-shared"
                >
                    for {company.dataSharingPurposes.length} purposes
                </button>
                <button
                    onClick={() =>
                        onShowScreenChange("companies", company.name)
                    }
                    className="featured-content-button companies-shared"
                >
                    with {company.sharedWithCompanies.length} companies
                </button>
                <button
                    onClick={() =>
                        onShowScreenChange("jurisdictions", company.name)
                    }
                    className="featured-content-button jurisdictions-shared"
                >
                    in {company.jurisdictions.children.length} jurisdictions
                </button>
            </div>
        );
    };

    return (
        <div className="featured-company-card">
            <h2 className="featured-company-name">{company.name}</h2>
            <p className="featured-company-text">Company Information</p>
            {getContentButtons()}
        </div>
    );
};

export default FeaturedCompany;
