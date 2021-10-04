import React, { useContext } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";

import i18n from "../../i18n.js";

import "./baseInfoScreen.css";

const InfoScreen = ({ child1, child2 }) => {
    const { handleBack } = useContext(ImporterContext);
    return (
        <div className="base-info">
            <div className="info-title">
                <img src="./images/line-title.svg" />
                <h1>{i18n.t("baseInfoScreen:title1")}</h1>
                <img src="./images/line-title.svg" />
            </div>
            {child1}
            <div className="info-title">
                <img src="./images/line-title.svg" />
                <h1>{i18n.t("baseInfoScreen:title2")}</h1>
                <img src="./images/line-title.svg" />
            </div>
            {child2}
            <button onClick={() => handleBack()}>
                {i18n.t("common:button.ok")}
            </button>
        </div>
    );
};

export default InfoScreen;
