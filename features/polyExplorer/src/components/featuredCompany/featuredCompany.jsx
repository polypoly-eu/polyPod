import React from "react";
import i18n from "../../i18n.js";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";
import "./featuredCompany.css";

const DataSharingGauge = ({ count, max, average }) => {
    const countPercentage = (count / max) * 100;
    const averagePercentage = (average / max) * 100;
    return (
        <div className="data-sharing-gauge">
            <div className="data-sharing-gauge-outline"></div>
            <div
                className={
                    "data-sharing-gauge-fill" +
                    (countPercentage <= 98 ? " partial" : "")
                }
                style={{ width: `${countPercentage}%` }}
            ></div>
            <div
                className={
                    "data-sharing-gauge-average-marker " +
                    (averagePercentage > countPercentage ? "light" : "dark")
                }
                style={{ width: `${averagePercentage}%` }}
            >
                <div className="data-sharing-gauge-average-label">
                    {average}
                </div>
            </div>
            <div className="data-sharing-gauge-max-label">{max}</div>
        </div>
    );
};

const DataSharingButton = ({
    sharingType,
    count,
    max,
    average,
    onOpenDetails,
}) => (
    <button
        onClick={onOpenDetails}
        className={`data-sharing-button ${sharingType}-shared`}
    >
        <h1>{i18n.t(`common:sharing.prefix.${sharingType}`)}</h1>
        <h2>
            {count} {i18n.t(`common:sharing.${sharingType}`)}
        </h2>
        <DataSharingGauge count={count} max={max} average={average} />
    </button>
);

const FeaturedCompany = ({
    company,
    maxValues,
    averageValues,
    onShowScreenChange,
}) => (
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
                average={averageValues.dataTypes}
                onOpenDetails={() =>
                    onShowScreenChange("dataTypes", company.name)
                }
            />
            <DataSharingButton
                sharingType="purposes"
                count={company.dataSharingPurposes.length}
                max={maxValues.purposes}
                average={averageValues.purposes}
                onOpenDetails={() =>
                    onShowScreenChange("purposes", company.name)
                }
            />
            <DataSharingButton
                sharingType="companies"
                count={company.sharedWithCompanies.length}
                max={maxValues.companies}
                average={averageValues.companies}
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
                average={averageValues.jurisdictions}
                onOpenDetails={() =>
                    onShowScreenChange("jurisdictions", company.name)
                }
            />
        </div>
    </div>
);

export default FeaturedCompany;
