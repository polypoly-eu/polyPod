import React from "react";
import i18n from "../../i18n.js";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";
import DataSharingGauge from "../dataSharingGauge/dataSharingGauge.jsx";
import DataSharingLegend from "../dataSharingLegend/dataSharingLegend.jsx";
import Scrollable from "../scrollable/scrollable.jsx";
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
    onOpenDetails,
    onOpenInfo,
    onOpenDataExplorationSection,
}) => {
    return (
        <Scrollable>
            <div className="featured-company-card">
                <div className="short-info-margin">
                    <CompanyShortInfo
                        company={company}
                        onOpenDetails={onOpenDetails}
                    />
                </div>
                <div className="data-sharing-section-list">
                    <DataSharingSection
                        sharingType="dataTypes"
                        count={company.dataTypesShared.length}
                        max={maxValues.dataTypes}
                        average={averageValues.dataTypes}
                        onOpenDetails={() =>
                            onOpenDataExplorationSection(
                                "dataTypes",
                                company.ppid
                            )
                        }
                    />
                    <DataSharingSection
                        sharingType="purposes"
                        count={company.dataSharingPurposes.length}
                        max={maxValues.purposes}
                        average={averageValues.purposes}
                        onOpenDetails={() =>
                            onOpenDataExplorationSection(
                                "purposes",
                                company.ppid
                            )
                        }
                    />
                    <DataSharingSection
                        sharingType="companies"
                        count={company.dataRecipients.length}
                        max={maxValues.companies}
                        average={averageValues.companies}
                        onOpenDetails={() =>
                            onOpenDataExplorationSection(
                                "companies",
                                company.ppid
                            )
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
                        onOpenDetails={() =>
                            onOpenDataExplorationSection(
                                "jurisdictions",
                                company.ppid
                            )
                        }
                    />
                    <DataSharingLegend onClick={onOpenInfo} />
                </div>
            </div>
        </Scrollable>
    );
};

export default FeaturedCompany;
