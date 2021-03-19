import React from "react";

import i18n from "../../../i18n.js";
import ExplorationInfoScreen from "../../../components/explorationInfoScreen/explorationInfoScreen.jsx";
import Inforgraphic from "../../../components/infographic/infographic.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const CorrelationInfo = ({ onClose }) => {
    return (
        <ExplorationInfoScreen
            className="correlation-info"
            headline={i18n.t("explorationCorrelationInfoScreen:headline")}
            onClose={onClose}
        >
            <p>Dieser Bereich ist noch nicht fertig.</p>
            <Infographic svgName="correlation" />
        </ExplorationInfoScreen>
    );
};

export default CorrelationInfo;
