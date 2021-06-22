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
    stateChange,
}) => (
    <LinkButton
        className={`data-sharing-section ${sharingType}-shared`}
        stateChange={stateChange}
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
    } = useContext(ExplorerContext);
    const company = selectedCompanyObject;
    return (
        <div className="featured-company-card">
            <div className="data-sharing-section-list">
                <DataSharingSection
                    sharingType="dataTypes"
                    count={company.dataTypesShared.length}
                    max={featuredCompanyMaxValues.dataTypes}
                    average={featuredCompanyAverageValues.dataTypes}
                    stateChange={{
                        explorationState: {
                            section: "dataTypes",
                            index: null,
                            category: null,
                        },
                    }}
                />
                <DataSharingSection
                    sharingType="purposes"
                    count={company.dataSharingPurposes.length}
                    max={featuredCompanyMaxValues.purposes}
                    average={featuredCompanyAverageValues.purposes}
                    stateChange={{
                        explorationState: {
                            section: "purposes",
                            index: null,
                            category: null,
                        },
                    }}
                />
                <DataSharingSection
                    sharingType="companies"
                    count={company.dataRecipients.length}
                    max={featuredCompanyMaxValues.companies}
                    average={featuredCompanyAverageValues.companies}
                    stateChange={{
                        explorationState: {
                            section: "companies",
                            index: null,
                            category: null,
                        },
                    }}
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
                    stateChange={{
                        explorationState: {
                            section: "jurisdictions",
                            index: null,
                            category: null,
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default FeaturedCompany;
