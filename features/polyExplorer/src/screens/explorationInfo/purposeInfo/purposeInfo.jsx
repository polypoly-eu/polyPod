import React from "react";

import i18n from "../../../i18n.js";
import ExplorationInfoScreen from "../../../components/explorationInfoScreen/explorationInfoScreen.jsx";

const PurposeInfo = ({ onClose }) => {
    return (
        <ExplorationInfoScreen
            className="purpose-info"
            headline={i18n.t("explorationPurposeInfoScreen:headline")}
            onClose={onClose}
        >
            <p>{i18n.t("explorationPurposeInfoScreen:text.1")}</p>
            <img
                src={`./images/infographics/purpose/${i18n.t(
                    "common:country.image.ending"
                )}.svg`}
            />
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("explorationPurposeInfoScreen:text.2"),
                }}
            />
        </ExplorationInfoScreen>
    );
};

export default PurposeInfo;
