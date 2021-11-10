import React from "react";
import i18n from "../../i18n.js";
import "./companyShortInfo.css";

const CompanyShortInfo = ({ company, onOpenDetails = () => {} }) => {
    return (
        <button
            onClick={() => onOpenDetails(company.ppid)}
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
                    <p className="location-name">
                        {company.location
                            ? `${
                                  company.location.city
                                      ? company.location.city + ","
                                      : ""
                              } ${company.location.countryCode}, `
                            : null}
                        <span
                            className={`circle ${company.jurisdiction}`}
                        ></span>
                        {company.jurisdiction || null}
                    </p>
                </div>
                <div className="company-category">
                    <p className="category-name">
                        {company.industryCategory
                            ? company.industryCategory.name[i18n.language]
                            : i18n.t("common:category.undisclosed")}
                    </p>
                </div>
            </div>
        </button>
    );
};

export default CompanyShortInfo;
