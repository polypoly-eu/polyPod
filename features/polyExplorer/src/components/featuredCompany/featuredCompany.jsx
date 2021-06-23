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

    const count = {
        dataTypes: company.dataTypesShared.length,
        purposes: company.dataSharingPurposes.length,
        companies: company.dataRecipients.length,
        jurisdictions: company.jurisdictionsShared
            ? company.jurisdictionsShared.children.length
            : 0,
    };

    const dataSharingSections = [
        "dataTypes",
        "purposes",
        "companies",
        "jurisdictions",
    ];

    return (
        <div className="featured-company-card">
            <div className="data-sharing-section-list">
                {dataSharingSections.map((section) => (
                    <DataSharingSection
                        key={section}
                        sharingType={section}
                        count={count[section]}
                        max={featuredCompanyMaxValues[section]}
                        average={featuredCompanyAverageValues[section]}
                        stateChange={{
                            explorationState: {
                                section: section,
                                index: null,
                                category: null,
                            },
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturedCompany;
