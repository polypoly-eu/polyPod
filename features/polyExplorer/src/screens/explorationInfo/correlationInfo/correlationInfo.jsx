import React from "react";

import i18n from "../../../i18n.js";
import ExplorationInfoScreen from "../../../components/explorationInfoScreen/explorationInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const CorrelationInfo = ({ onClose }) => {
    return (
        <ExplorationInfoScreen
            className="correlation-info"
            headline={i18n.t("explorationCorrelationInfoScreen:headline")}
            onClose={onClose}
        >
            <p>{i18n.t("explorationCorrelationInfoScreen:text.1")}</p>
            <Infographic svgName="correlation" />
        </ExplorationInfoScreen>
    );
};

export default CorrelationInfo;
