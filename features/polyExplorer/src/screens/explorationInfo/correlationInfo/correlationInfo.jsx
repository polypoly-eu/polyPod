import React from "react";

import i18n from "../../../i18n.js";
import highlights from "../../../data/highlights.js";
import BaseInfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";

const CorrelationInfo = ({ company, onClose }) => {
    return (
        <BaseInfoScreen
            className="correlation-info"
            headline={i18n.t("explorationCorrelationInfoScreen:headline")}
            onClose={onClose}
        >
            <div className="base-info-padding">
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
        </BaseInfoScreen>
    );
};

export default CorrelationInfo;
