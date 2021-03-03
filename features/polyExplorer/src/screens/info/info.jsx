import React from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";

import "./info.css";

const InfoScreen = ({ onClose }) => (
    <Screen className="info-screen">
        <h1>{i18n.t("infoScreen:headline.sources")}</h1>
        <p>{i18n.t("infoScreen:text.sources")}</p>
        <img src="images/info-sources.svg"></img>

        <h1>{i18n.t("infoScreen:headline.research")}</h1>
        <div
            dangerouslySetInnerHTML={{
                __html: i18n.t("infoScreen:text.research.first"),
            }}
        ></div>
        <img src="images/info-research.svg"></img>
        <div
            dangerouslySetInnerHTML={{
                __html: i18n.t("infoScreen:text.research.second"),
            }}
        ></div>

        <h1>{i18n.t("infoScreen:headline.validation")}</h1>
        <p>{i18n.t("infoScreen:text.validation")}</p>

        <h1>{i18n.t("infoScreen:headline.aggregation")}</h1>
        <img src="images/info-aggregation.svg"></img>
        <p>{i18n.t("infoScreen:text.aggregation")}</p>

        <h1>{i18n.t("infoScreen:headline.presentation")}</h1>
        <p>{i18n.t("infoScreen:text.presentation")}</p>

        <button onClick={onClose}>{i18n.t("infoScreen:button.explore")}</button>
    </Screen>
);

export default InfoScreen;
