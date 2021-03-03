import React from "react";
import i18n from "../../i18n.js";
import "./companyShortInfo.css";

const CompanyShortInfo = ({ company, onShowScreenChange = () => {} }) => {
    return (
        <button
            onClick={() => onShowScreenChange("companyInfo", company.name)}
            className="company-short-info"
        >
            {company.featured ? (
                <img
                    src="./images/star.svg"
                    alt=""
                    className="featured-indicator"
                />
            ) : (
                <div className="non-featured-aligner" />
            )}
            <div className="info-box">
                <p className="company-name">{company.name}</p>
                <div className="company-location">
                    <div className="location-icon"></div>
                    <p className="location-name">
                        {company.location.city}, {company.location.countryCode},{" "}
                        <span className="jurisdiction-name">
                            {company.jurisdiction}
                        </span>
                    </p>
                </div>
                <div className="company-category">
                    <div className="category-icon"></div>
                    <p className="category-name">
                        {i18n.t("common:category.undisclosed")}
                    </p>
                </div>
            </div>
        </button>
    );
};

export default CompanyShortInfo;
