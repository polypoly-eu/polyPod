import React from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";

import "./info.css";

const GaugeExplanationGraphic = () => (
    <div className="gauge-explanation-graphic">
        <span>{i18n.t("infoScreen:gaugeExplanation.first")}</span>
        <img srcSet="images/gauge-explanation-2x.png 2x"></img>
        <span>{i18n.t("infoScreen:gaugeExplanation.second")}</span>
        <span>{i18n.t("infoScreen:gaugeExplanation.third")}</span>
        <span>{i18n.t("infoScreen:gaugeExplanation.fourth")}</span>
    </div>
);

const InfoScreen = ({ onClose }) => (
    <Screen className="info-screen">
        <h1>{i18n.t("infoScreen:headline.main")}</h1>
        <p>{i18n.t("infoScreen:text.main")}</p>

        <GaugeExplanationGraphic />

        <h2>{i18n.t("infoScreen:headline.average")}</h2>
        <p>{i18n.t("infoScreen:text.average")}</p>

        <h2>{i18n.t("infoScreen:headline.total")}</h2>
        <p>{i18n.t("infoScreen:text.total")}</p>

        <button onClick={onClose}>{i18n.t("infoScreen:button.explore")}</button>
    </Screen>
);

export default InfoScreen;
