import React from "react";
import i18n from "../../i18n.js";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";
import DataSharingGauge from "./dataSharingGauge.jsx";
import "./featuredCompany.css";

const DataSharingSection = ({
    sharingType,
    count,
    max,
    average,
    onOpenDetails,
    showLegend = false,
    onLegendClick = () => {},
}) => (
    <div className={`data-sharing-section ${sharingType}-shared`}>
        <div onClick={onOpenDetails}>
            <h1>{i18n.t(`common:sharing.prefix.${sharingType}`)}</h1>
            <h2>
                {count} {i18n.t(`common:sharing.${sharingType}`)}
            </h2>
        </div>
        <DataSharingGauge
            sharingType={sharingType}
            count={count}
            max={max}
            average={average}
            onClick={onOpenDetails}
            showLegend={showLegend}
            onLegendClick={onLegendClick}
        />
    </div>
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
        <div className="data-sharing-section-list">
            <DataSharingSection
                sharingType="dataTypes"
                count={company.dataTypesShared.length}
                max={maxValues.dataTypes}
                average={averageValues.dataTypes}
                onOpenDetails={() =>
                    onShowScreenChange("dataExploration", company.name)
                }
            />
            <DataSharingSection
                sharingType="purposes"
                count={company.dataSharingPurposes.length}
                max={maxValues.purposes}
                average={averageValues.purposes}
                onOpenDetails={() =>
                    onShowScreenChange("dataExploration", company.name)
                }
            />
            <DataSharingSection
                sharingType="companies"
                count={company.sharedWithCompanies.length}
                max={maxValues.companies}
                average={averageValues.companies}
                onOpenDetails={() =>
                    onShowScreenChange("dataExploration", company.name)
                }
            />
            <DataSharingSection
                sharingType="jurisdictions"
                count={
                    company.jurisdictionsShared
                        ? company.jurisdictionsShared.children.length
                        : 0
                }
                max={maxValues.jurisdictions}
                average={averageValues.jurisdictions}
                showLegend="true"
                onLegendClick={() => onShowScreenChange("featuredCompanyHelp")}
                onOpenDetails={() =>
                    onShowScreenChange("dataExploration", company.name)
                }
            />
        </div>
    </div>
);

export default FeaturedCompany;
