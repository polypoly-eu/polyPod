import React from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";

import "./info.css";

const InfoScreen = ({ onClose }) => (
    <Screen className="info-screen" light={true}>
        <div
            dangerouslySetInnerHTML={{
                __html: i18n.t("infoScreen:text.intro"),
            }}
        ></div>

        <h1>{i18n.t("infoScreen:headline.sources")}</h1>
        <div
            dangerouslySetInnerHTML={{
                __html: i18n.t("infoScreen:text.sources"),
            }}
        ></div>
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
        <div
            dangerouslySetInnerHTML={{
                __html: i18n.t("infoScreen:text.validation"),
            }}
        ></div>

        {/* Hidden for now until we can come up with a text*/}
        <div style={{ display: "none" }}>
            <h1>{i18n.t("infoScreen:headline.aggregation")}</h1>
            <img src="images/info-aggregation.svg"></img>
            <p>{i18n.t("infoScreen:text.aggregation")}</p>
        </div>

        <h1>{i18n.t("infoScreen:headline.presentation")}</h1>
        <div
            dangerouslySetInnerHTML={{
                __html: i18n.t("infoScreen:text.presentation"),
            }}
        ></div>

        <button onClick={onClose}>{i18n.t("infoScreen:button.explore")}</button>
    </Screen>
);

export default InfoScreen;
