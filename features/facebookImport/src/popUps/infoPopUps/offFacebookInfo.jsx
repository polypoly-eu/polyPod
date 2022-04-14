import React from "react";

import i18n from "../../i18n.js";
import BaseInfoPopUp from "../baseInfoPopUp/baseInfoPopUp.jsx";
import Infographic from "../../components/infographic/infographic.jsx";

const OffFacebookInfoScreen = () => {
    const offFacebookInfoText = [
        <>
            <p>{i18n.t("offFacebookInfoScreen:text1")}</p>
            <Infographic
                type="offFacebookBarChart"
                texts={{
                    text1: i18n.t("infographics:offFacebookBarChart.text1"),
                    text2: i18n.t("infographics:offFacebookBarChart.text2"),
                    bigbold1: i18n.t(
                        "infographics:offFacebookBarChart.bigbold1"
                    ),
                    bold2_1: i18n.t("infographics:offFacebookBarChart.bold2"),
                    bold2_2: i18n.t("infographics:offFacebookBarChart.bold2"),
                    bold2_3: i18n.t("infographics:offFacebookBarChart.bold2"),
                    bold2_4: i18n.t("infographics:offFacebookBarChart.bold2"),
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

    return <BaseInfoPopUp infoChildren={offFacebookInfoText} />;
};

export default OffFacebookInfoScreen;
