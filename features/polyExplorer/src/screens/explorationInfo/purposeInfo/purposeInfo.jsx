import React from "react";

import i18n from "../../../i18n.js";
import InfoScreen from "../../../components/infoScreen/infoScreen.jsx";

const PurposeInfo = ({ onClose }) => {
    return (
        <InfoScreen
            className="purpose-info"
            headline={i18n.t("explorationPurposeInfoScreen:headline")}
            onClose={onClose}
        >
            <p>{i18n.t("explorationPurposeInfoScreen:text.1")}</p>
            <img
                src={`./images/infographics/purpose/${i18n.t(
                    "common:country.code"
                )}.svg`}
            />
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("explorationPurposeInfoScreen:text.2"),
                }}
            />
        </InfoScreen>
    );
};

export default PurposeInfo;
