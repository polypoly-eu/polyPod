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
            <p>Dieser Bereich ist noch nicht fertig.</p>
            <img src="images/construction.gif"></img>
        </ExplorationInfoScreen>
    );
};

export default PurposeInfo;
