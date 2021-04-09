import React from "react";

import i18n from "../../../i18n.js";
import highlights from "../../../data/highlights.js";
import InfoScreen from "../../../components/infoScreen/infoScreen.jsx";

const CorrelationInfo = ({ company, onClose }) => {
    return (
        <InfoScreen
            className="correlation-info"
            headline={i18n.t("explorationCorrelationInfoScreen:headline")}
            onClose={onClose}
        >
            <div className="info-padding">
                <p>{i18n.t("explorationCorrelationInfoScreen:text.1")}</p>
                <img
                    src={`./images/infographics/correlation/${i18n.t(
                        "common:country.code"
                    )}.svg`}
                />
                <p>
                    {
                        highlights[company.name].dataTypeCorrelation
                            .explanation[i18n.t("common:country.code")]
                    }
                </p>
            </div>
        </InfoScreen>
    );
};

export default CorrelationInfo;
