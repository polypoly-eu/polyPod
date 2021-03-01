import React from "react";
import i18n from "../../i18n.js";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";
import "./featuredCompany.css";

const FeaturedCompany = ({ company, onShowScreenChange }) => {
    const getContentButtons = () => {
        return (
            <div className="featured-content-button-holder">
                <button
                    onClick={() =>
                        onShowScreenChange("dataTypes", company.name)
                    }
                    className="featured-content-button data-shared"
                >
                    {i18n.t("common:sharing.shares")}{" "}
                    {company.dataTypesShared.length}{" "}
                    {i18n.t("common:sharing.dataTypes")}
                </button>
                <button
                    onClick={() => onShowScreenChange("purposes", company.name)}
                    className="featured-content-button purpose-shared"
                >
                    {i18n.t("common:sharing.for")}{" "}
                    {company.dataSharingPurposes.length}{" "}
                    {i18n.t("common:sharing.purposes")}
                </button>
                <button
                    onClick={() =>
                        onShowScreenChange("companies", company.name)
                    }
                    className="featured-content-button companies-shared"
                >
                    {i18n.t("common:sharing.with")}{" "}
                    {company.sharedWithCompanies.length}{" "}
                    {i18n.t("common:sharing.companies")}
                </button>
                {company.jurisdictionsShared === undefined ? (
                    <button className="featured-content-button jurisdictions-shared">
                        {i18n.t("common:sharing.in")}
                        {" X "}
                        {i18n.t("common:sharing.jurisdictions")}
                    </button>
                ) : (
                    <button
                        onClick={() =>
                            onShowScreenChange("jurisdictions", company.name)
                        }
                        className="featured-content-button jurisdictions-shared"
                    >
                        {i18n.t("common:sharing.in")}{" "}
                        {company.jurisdictionsShared.children.length}{" "}
                        {i18n.t("common:sharing.jurisdictions")}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="featured-company-card">
            <CompanyShortInfo
                company={company}
                onShowScreenChange={onShowScreenChange}
            />
            {getContentButtons()}
        </div>
    );
};

export default FeaturedCompany;
