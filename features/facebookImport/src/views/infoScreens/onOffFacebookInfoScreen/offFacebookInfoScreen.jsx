import React from "react";

import i18n from "../../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const OffFacebookInfoScreen = () => {
    const offFacebookInfoText = [
        <>
            <p>{i18n.t("offFacebookInfoScreen:text1")}</p>
            <Infographic
                type="barChartInfoScreen"
                texts={{
                    text1: i18n.t("infographics:offFacebookBarChart.text1"),
                    text2: i18n.t("infographics:offFacebookBarChart.text2"),
                    bigbold1: i18n.t(
                        "infographics:offFacebookBarChart.bigbold1"
                    ),
                    bold2: i18n.t("infographics:offFacebookBarChart.bold2"),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`offFacebookInfoScreen:text2`),
                }}
            />
        </>,
        <>
            <p>{i18n.t("offFacebookInfoScreen:text3")}</p>
            <p>{i18n.t("offFacebookInfoScreen:text4")}</p>
            <p>{i18n.t("offFacebookInfoScreen:text5")}</p>
            <p>{i18n.t("offFacebookInfoScreen:text6")}</p>
        </>,
    ];

    return <InfoScreen infoChildren={offFacebookInfoText} />;
};

export default OffFacebookInfoScreen;
