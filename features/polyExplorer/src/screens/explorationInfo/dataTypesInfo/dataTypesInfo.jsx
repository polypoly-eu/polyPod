import React from "react";

import i18n from "../../../i18n.js";
import ExplorationInfoScreen from "../../../components/explorationInfoScreen/explorationInfoScreen.jsx";

const DataTypesInfo = ({ onClose }) => {
    return (
        <ExplorationInfoScreen
            className="data-types-info"
            headline={i18n.t("explorationDataTypesInfoScreen:headline")}
            onClose={onClose}
        >
            <p>{i18n.t("explorationDataTypesInfoScreen:text.1")}</p>
            <img
                src={`./images/infographics/dataTypes/${i18n.t(
                    "common:country.image.ending"
                )}.svg`}
            />
            <h2>{i18n.t("explorationDataTypesInfoScreen:subheading.1")}</h2>
            <p>{i18n.t("explorationDataTypesInfoScreen:text.2")}</p>
        </ExplorationInfoScreen>
    );
};

export default DataTypesInfo;
