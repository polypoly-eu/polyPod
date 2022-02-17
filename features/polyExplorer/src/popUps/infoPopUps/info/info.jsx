import React from "react";

import i18n from "../../../i18n.js";
import BaseInfoPopUp from "../baseInfoPopUp/baseInfoPopUp.jsx";

import "./info.css";

const InfoScreen = ({ onClose }) => (
    <BaseInfoPopUp className="info-screen" onClose={onClose}>
        <div className="base-info-padding">
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

            <div>
                <h1>{i18n.t("infoScreen:headline.aggregation")}</h1>
                <img src="images/info-aggregation.svg"></img>
                <div
                    dangerouslySetInnerHTML={{
                        __html: i18n.t("infoScreen:text.aggregation"),
                    }}
                ></div>
            </div>

            <h1>{i18n.t("infoScreen:headline.presentation")}</h1>
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("infoScreen:text.presentation"),
                }}
            ></div>

            <h1>{i18n.t("infoScreen:headline.validation")}</h1>
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("infoScreen:text.validation"),
                }}
            ></div>
        </div>
    </BaseInfoPopUp>
);

export default InfoScreen;
