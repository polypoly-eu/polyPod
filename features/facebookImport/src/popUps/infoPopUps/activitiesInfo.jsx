import React from "react";

import i18n from "../../i18n.js";
import BaseInfoPopUp from "../baseInfoPopUp/baseInfoPopUp.jsx";
import Infographic from "../../components/infographic/infographic.jsx";

import "./infoPopUps.css";

const ActivitiesInfoScreen = () => {
    const activitiesInfoText = [
        <>
            <p>{i18n.t("activitiesInfoScreen:text1")}</p>
            <div className="legend chart-description-title">
                {i18n.t("activitiesInfoScreen:legend")}
            </div>
            <Infographic
                type="activitiesBarChart"
                texts={{
                    text1: i18n.t("infographics:activitiesBarChart.text1"),
                    bigbold1: i18n.t(
                        "infographics:activitiesBarChart.bigbold1"
                    ),
                    bold1: i18n.t("infographics:activitiesBarChart.bold1"),
                    bold2: i18n.t("infographics:activitiesBarChart.bold2"),
                    boldJan: i18n.t("infographics:activitiesBarChart.boldJan"),
                    boldFeb: i18n.t("infographics:activitiesBarChart.boldFeb"),
                    boldMar: i18n.t("infographics:activitiesBarChart.boldMar"),
                    boldApr: i18n.t("infographics:activitiesBarChart.boldApr"),
                    boldMay: i18n.t("infographics:activitiesBarChart.boldMay"),
                    boldJun: i18n.t("infographics:activitiesBarChart.boldJun"),
                    boldJul: i18n.t("infographics:activitiesBarChart.boldJul"),
                    boldAug: i18n.t("infographics:activitiesBarChart.boldAug"),
                    boldSep: i18n.t("infographics:activitiesBarChart.boldSep"),
                    boldOct: i18n.t("infographics:activitiesBarChart.boldOct"),
                    boldNov: i18n.t("infographics:activitiesBarChart.boldNov"),
                    boldDec: i18n.t("infographics:activitiesBarChart.boldDec"),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`activitiesInfoScreen:text2`),
                }}
            />
        </>,
        <>
            <p>{i18n.t("activitiesInfoScreen:text3")}</p>
            <p>{i18n.t("activitiesInfoScreen:text4")}</p>
        </>,
    ];

    return <BaseInfoPopUp infoChildren={activitiesInfoText} />;
};

export default ActivitiesInfoScreen;
