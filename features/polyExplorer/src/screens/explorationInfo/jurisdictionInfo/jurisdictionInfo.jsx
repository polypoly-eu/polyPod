import React from "react";

import i18n from "../../../i18n.js";
import ExplorationInfoScreen from "../../../components/explorationInfoScreen/explorationInfoScreen.jsx";
//import Infographic from "../../../components/infographic/infographic.jsx";

const JurisdictionInfo = ({ onClose }) => {
    return (
        <ExplorationInfoScreen
            className="data-types-info"
            headline={i18n.t("explorationJurisdictionInfoScreen:headline")}
            onClose={onClose}
        >
            <p>{i18n.t("explorationJurisdictionInfoScreen:text.1")}</p>
            <h2>{i18n.t("explorationJurisdictionInfoScreen:subheading.1")}</h2>
            <p>{i18n.t("explorationJurisdictionInfoScreen:text.2")}</p>
            <h2>{i18n.t("explorationJurisdictionInfoScreen:subheading.2")}</h2>
            <p>{i18n.t("explorationJurisdictionInfoScreen:text.3")}</p>
        </ExplorationInfoScreen>
    );
};

export default JurisdictionInfo;
