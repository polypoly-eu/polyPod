import React from "react";
import i18n from "../../i18n.js";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";
import DataSharingGauge from "../dataSharingGauge/dataSharingGauge.jsx";
import DataSharingLegend from "../dataSharingLegend/dataSharingLegend.jsx";
import "./featuredCompany.css";

const DataSharingSection = ({
    sharingType,
    count,
    max,
    average,
    onOpenDetails,
}) => (
    <div
        className={`data-sharing-section ${sharingType}-shared`}
        onClick={onOpenDetails}
    >
        <h1>{i18n.t(`common:sharing.prefix.${sharingType}`)}</h1>
        <DataSharingGauge
            sharingType={sharingType}
            count={count}
            max={max}
            average={average}
        />
    </div>
);

const FeaturedCompany = ({
    company,
    maxValues,
    averageValues,
    onActiveScreenChange,
}) => {
    const handleOpenDetails = () =>
        onActiveScreenChange("dataExploration", company.name);

    return (
        <div className="featured-company-card">
            <div className="short-info-margin">
                <CompanyShortInfo
                    company={company}
                    onActiveScreenChange={onActiveScreenChange}
                />
            </div>
            <div className="data-sharing-section-list">
                <DataSharingSection
                    sharingType="dataTypes"
                    count={company.dataTypesShared.length}
                    max={maxValues.dataTypes}
                    average={averageValues.dataTypes}
                    onOpenDetails={handleOpenDetails}
                />
                <DataSharingSection
                    sharingType="purposes"
                    count={company.dataSharingPurposes.length}
                    max={maxValues.purposes}
                    average={averageValues.purposes}
                    onOpenDetails={handleOpenDetails}
                />
                <DataSharingSection
                    sharingType="companies"
                    count={company.dataRecipients.length}
                    max={maxValues.companies}
                    average={averageValues.companies}
                    onOpenDetails={handleOpenDetails}
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
                    onOpenDetails={handleOpenDetails}
                />
                <DataSharingLegend
                    onClick={() => onActiveScreenChange("featuredCompanyHelp")}
                />
            </div>
        </div>
    );
};

export default FeaturedCompany;
