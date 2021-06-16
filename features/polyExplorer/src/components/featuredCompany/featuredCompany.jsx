import React, { useContext } from "react";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import DataSharingGauge from "../dataSharingGauge/dataSharingGauge.jsx";
import LinkButton from "../linkButton/linkButton.jsx";
import "./featuredCompany.css";

const DataSharingSection = ({
    sharingType,
    count,
    max,
    average,
    onOpenDetails,
}) => (
    <LinkButton
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
    </LinkButton>
);

const FeaturedCompany = () => {
    const {
        selectedCompanyObject,
        featuredCompanyMaxValues,
        featuredCompanyAverageValues,
        handleOpenDataExplorationSection,
    } = useContext(ExplorerContext);
    const company = selectedCompanyObject;
    const onOpenDataExplorationSection = handleOpenDataExplorationSection;
    return (
        <div className="featured-company-card">
            <div className="data-sharing-section-list">
                <DataSharingSection
                    sharingType="dataTypes"
                    count={company.dataTypesShared.length}
                    max={featuredCompanyMaxValues.dataTypes}
                    average={featuredCompanyAverageValues.dataTypes}
                    onOpenDetails={() =>
                        onOpenDataExplorationSection("dataTypes")
                    }
                />
                <DataSharingSection
                    sharingType="purposes"
                    count={company.dataSharingPurposes.length}
                    max={featuredCompanyMaxValues.purposes}
                    average={featuredCompanyAverageValues.purposes}
                    onOpenDetails={() =>
                        onOpenDataExplorationSection("purposes")
                    }
                />
                <DataSharingSection
                    sharingType="companies"
                    count={company.dataRecipients.length}
                    max={featuredCompanyMaxValues.companies}
                    average={featuredCompanyAverageValues.companies}
                    onOpenDetails={() =>
                        onOpenDataExplorationSection("companies")
                    }
                />
                <DataSharingSection
                    sharingType="jurisdictions"
                    count={
                        company.jurisdictionsShared
                            ? company.jurisdictionsShared.children.length
                            : 0
                    }
                    max={featuredCompanyMaxValues.jurisdictions}
                    average={featuredCompanyAverageValues.jurisdictions}
                    onOpenDetails={() =>
                        onOpenDataExplorationSection("jurisdictions")
                    }
                />
            </div>
        </div>
    );
};

export default FeaturedCompany;
