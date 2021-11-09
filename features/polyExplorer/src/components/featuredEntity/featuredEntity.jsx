import React, { useContext } from "react";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import DataSharingGauge from "../dataSharingGauge/dataSharingGauge.jsx";
import LinkButton from "../buttons/linkButton/linkButton.jsx";
import "./featuredEntity.css";

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

const FeaturedEntity = () => {
    const {
        selectedEntityObject,
        featuredEntityMaxValues,
        featuredEntityAverageValues,
    } = useContext(ExplorerContext);
    const entity = selectedEntityObject;

    const count = {
        dataTypes: entity.dataTypesShared.length,
        purposes: entity.dataSharingPurposes.length,
        companies: entity.dataRecipients.length,
        jurisdictions: entity.jurisdictionsShared
            ? entity.jurisdictionsShared.children.length
            : 0,
    };

    const dataSharingSections = [
        "dataTypes",
        "purposes",
        "companies",
        "jurisdictions",
    ];

    return (
        <div className="featured-entity-card">
            <div className="data-sharing-section-list">
                {dataSharingSections.map((section) => (
                    <DataSharingSection
                        key={section}
                        sharingType={section}
                        count={count[section]}
                        max={featuredEntityMaxValues[section]}
                        average={featuredEntityAverageValues[section]}
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

export default FeaturedEntity;
