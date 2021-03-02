import React from "react";
import i18n from "../../i18n.js";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";
import "./featuredCompany.css";

const DataSharingGauge = ({ count, max }) => {
    const percentage = (count / max) * 100;
    return (
        <div className="data-sharing-gauge">
            <div className="data-sharing-gauge-outline">
                <div
                    className="data-sharing-gauge-fill"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="data-sharing-gauge-max">{max}</div>
        </div>
    );
};

const DataSharingButton = ({ sharingType, count, max, onOpenDetails }) => (
    <button
        onClick={onOpenDetails}
        className={`data-sharing-button ${sharingType}-shared`}
    >
        <h1>{i18n.t(`common:sharing.prefix.${sharingType}`)}</h1>
        <h2>
            {count} {i18n.t(`common:sharing.${sharingType}`)}
        </h2>
        <DataSharingGauge count={count} max={max} />
    </button>
);

const FeaturedCompany = ({ company, maxValues, onShowScreenChange }) => (
    <div className="featured-company-card">
        <div className="short-info-margin">
            <CompanyShortInfo
                company={company}
                onShowScreenChange={onShowScreenChange}
            />
        </div>
        <div className="data-sharing-button-list">
            <DataSharingButton
                sharingType="dataTypes"
                count={company.dataTypesShared.length}
                max={maxValues.dataTypes}
                onOpenDetails={() =>
                    onShowScreenChange("dataTypes", company.name)
                }
            />
            <DataSharingButton
                sharingType="purposes"
                count={company.dataSharingPurposes.length}
                max={maxValues.purposes}
                onOpenDetails={() =>
                    onShowScreenChange("purposes", company.name)
                }
            />
            <DataSharingButton
                sharingType="companies"
                count={company.sharedWithCompanies.length}
                max={maxValues.companies}
                onOpenDetails={() =>
                    onShowScreenChange("companies", company.name)
                }
            />
            <DataSharingButton
                sharingType="jurisdictions"
                count={
                    company.jurisdictionsShared
                        ? company.jurisdictionsShared.children.length
                        : 0
                }
                max={maxValues.jurisdictions}
                onOpenDetails={() =>
                    onShowScreenChange("jurisdictions", company.name)
                }
            />
        </div>
    </div>
);

export default FeaturedCompany;
