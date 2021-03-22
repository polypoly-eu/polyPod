import React from "react";

import i18n from "../../../i18n.js";
import ExplorationInfoScreen from "../../../components/explorationInfoScreen/explorationInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const DataTypesInfo = ({ onClose }) => {
    return (
        <ExplorationInfoScreen
            className="data-types-info"
            headline={i18n.t("explorationDataTypesInfoScreen:headline")}
            onClose={onClose}
        >
            <p>{i18n.t("explorationDataTypesInfoScreen:text.1")}</p>
            <Infographic svgName="dataTypes" />
            <h2>{i18n.t("explorationDataTypesInfoScreen:subheading.1")}</h2>
            <p>{i18n.t("explorationDataTypesInfoScreen:text.2")}</p>
        </ExplorationInfoScreen>
    );
};

export default DataTypesInfo;
