import React from "react";

import i18n from "../../../i18n.js";
import highlights from "../../../data/highlights.js";
import ExplorationInfoScreen from "../../../components/explorationInfoScreen/explorationInfoScreen.jsx";

const CorrelationInfo = ({ company, onClose }) => {
    return (
        <ExplorationInfoScreen
            className="correlation-info"
            headline={i18n.t("explorationCorrelationInfoScreen:headline")}
            onClose={onClose}
        >
            <p>{i18n.t("explorationCorrelationInfoScreen:text.1")}</p>
            <img
                src={`./images/infographics/correlation/${i18n.t(
                    "common:country.code"
                )}.svg`}
            />
            <p>
                {
                    highlights[company.name].dataTypeCorrelation.explanation[
                        i18n.t("common:country.code")
                    ]
                }
            </p>
        </ExplorationInfoScreen>
    );
};

export default CorrelationInfo;
