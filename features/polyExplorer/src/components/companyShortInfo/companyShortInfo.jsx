import React from "react";
import "./companyShortInfo.css";

const CompanyShortInfo = ({ company, onShowScreenChange }) => {
    return (
        <button
            onClick={() => onShowScreenChange("companyInfo", company.name)}
            className="company-short-info"
        >
            <div className="company-logo"></div>
            <div className="info-box">
                <p className="company-name">{company.name}</p>
                <div className="company-location">
                    <div className="location-icon"></div>
                    <p className="location-name">
                        {company.location.city}, {company.location.countryCode},{" "}
                        {company.jurisdiction}
                    </p>
                </div>
            </div>
        </button>
    );
};

export default CompanyShortInfo;
