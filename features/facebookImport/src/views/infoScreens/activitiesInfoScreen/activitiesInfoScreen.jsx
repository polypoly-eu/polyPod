import React from "react";

import i18n from "../../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const ActivitiesInfoScreen = () => {
    const activitiesInfoText = [
        <>
            <p>{i18n.t("activitiesInfoScreen:text1")}</p>
            <p>
                <strong>{i18n.t("activitiesInfoScreen:legend")}</strong>
            </p>
            <Infographic
                type="activitiesBarChart"
                texts={{
                    text1: i18n.t("infographics:activitiesBarChart.text1"),
                    bold1: i18n.t("infographics:activitiesBarChart.bold1"),
                    smallbold1: i18n.t(
                        "infographics:activitiesBarChart.smallbold1"
                    ),
                    smallbold2: i18n.t(
                        "infographics:activitiesBarChart.smallbold2"
                    ),
                    smallboldJan: i18n.t(
                        "infographics:activitiesBarChart.smallboldJan"
                    ),
                    smallboldFeb: i18n.t(
                        "infographics:activitiesBarChart.smallboldFeb"
                    ),
                    smallboldMar: i18n.t(
                        "infographics:activitiesBarChart.smallboldMar"
                    ),
                    smallboldApr: i18n.t(
                        "infographics:activitiesBarChart.smallboldApr"
                    ),
                    smallboldMay: i18n.t(
                        "infographics:activitiesBarChart.smallboldMay"
                    ),
                    smallboldJun: i18n.t(
                        "infographics:activitiesBarChart.smallboldJun"
                    ),
                    smallboldJul: i18n.t(
                        "infographics:activitiesBarChart.smallboldJul"
                    ),
                    smallboldAug: i18n.t(
                        "infographics:activitiesBarChart.smallboldAug"
                    ),
                    smallboldSep: i18n.t(
                        "infographics:activitiesBarChart.smallboldSep"
                    ),
                    smallboldOct: i18n.t(
                        "infographics:activitiesBarChart.smallboldOct"
                    ),
                    smallboldNov: i18n.t(
                        "infographics:activitiesBarChart.smallboldNov"
                    ),
                    smallboldDec: i18n.t(
                        "infographics:activitiesBarChart.smallboldDec"
                    ),
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

    return (
        <InfoScreen
            child1={activitiesInfoText[0]}
            child2={activitiesInfoText[1]}
        />
    );
};

export default ActivitiesInfoScreen;
