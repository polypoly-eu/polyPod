import React from "react";
import i18n from "../../i18n.js";
import DataSharingGauge from "../dataSharingGauge/dataSharingGauge.jsx";
import PolyLink from "../polyLink/polyLink.jsx";
import "./featuredCompany.css";

const DataSharingSection = ({
    sharingType,
    count,
    max,
    average,
    onOpenDetails,
}) => (
    <div className={`data-sharing-section ${sharingType}-shared`}>
        <PolyLink
            className={`data-sharing-section ${sharingType}-shared`}
            onClick={onOpenDetails}
            route="/data-exploration"
        >
            <h1>{i18n.t(`common:sharing.prefix.${sharingType}`)}</h1>
            <DataSharingGauge
                sharingType={sharingType}
                count={count}
                max={max}
                average={average}
            />
        </PolyLink>
    </div>
);

const FeaturedCompany = ({
    company,
    maxValues,
    averageValues,
    onOpenDataExplorationSection,
}) => {
    return (
        <div className="featured-company-card">
            <div className="data-sharing-section-list">
                <DataSharingSection
                    sharingType="dataTypes"
                    count={company.dataTypesShared.length}
                    max={maxValues.dataTypes}
                    average={averageValues.dataTypes}
                    onOpenDetails={() =>
                        onOpenDataExplorationSection("dataTypes", company.ppid)
                    }
                />
                <DataSharingSection
                    sharingType="purposes"
                    count={company.dataSharingPurposes.length}
                    max={maxValues.purposes}
                    average={averageValues.purposes}
                    onOpenDetails={() =>
                        onOpenDataExplorationSection("purposes", company.ppid)
                    }
                />
                <DataSharingSection
                    sharingType="companies"
                    count={company.dataRecipients.length}
                    max={maxValues.companies}
                    average={averageValues.companies}
                    onOpenDetails={() =>
                        onOpenDataExplorationSection("companies", company.ppid)
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
            </div>
        </div>
    );
};

export default FeaturedCompany;
