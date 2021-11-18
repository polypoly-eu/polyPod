import React from "react";

import i18n from "../../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const OnOffFacebookInfoScreen = () => {
    const onOffFacebookInfoText = [
        <>
            <p>{i18n.t("onOffFacebookInfoScreen:text1")}</p>
            <Infographic
                type="onOffFacebookChart"
                texts={{
                    bigbold1: i18n.t(
                        "infographics:onOffFacebookChart.bigbold1"
                    ),
                    bigbold2: i18n.t(
                        "infographics:onOffFacebookChart.bigbold2"
                    ),
                    bold1: i18n.t("infographics:onOffFacebookChart.bold1"),
                    greylegend1: i18n.t(
                        "infographics:onOffFacebookChart.greylegend1"
                    ),
                    greylegend2: i18n.t(
                        "infographics:onOffFacebookChart.greylegend2"
                    ),
                    grey0: i18n.t("infographics:onOffFacebookChart.grey0"),
                    grey10: i18n.t("infographics:onOffFacebookChart.grey10"),
                    grey20: i18n.t("infographics:onOffFacebookChart.grey20"),
                    grey30: i18n.t("infographics:onOffFacebookChart.grey30"),
                    grey40: i18n.t("infographics:onOffFacebookChart.grey40"),
                    grey50: i18n.t("infographics:onOffFacebookChart.grey50"),
                    grey60: i18n.t("infographics:onOffFacebookChart.grey60"),
                    grey70: i18n.t("infographics:onOffFacebookChart.grey70"),
                    grey80: i18n.t("infographics:onOffFacebookChart.grey80"),
                    grey90: i18n.t("infographics:onOffFacebookChart.grey90"),
                    grey100: i18n.t("infographics:onOffFacebookChart.grey100"),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`onOffFacebookInfoScreen:text2`),
                }}
            />
            <p>{i18n.t("onOffFacebookInfoScreen:text3")}</p>
        </>,
        <>
            <p>{i18n.t("onOffFacebookInfoScreen:text4")}</p>
            <p>{i18n.t("onOffFacebookInfoScreen:text5")}</p>
            <p>{i18n.t("onOffFacebookInfoScreen:text6")}</p>
            <p>{i18n.t("onOffFacebookInfoScreen:text7")}</p>
            <p>{i18n.t("onOffFacebookInfoScreen:text8")}</p>
            <p>{i18n.t("onOffFacebookInfoScreen:text9")}</p>
        </>,
    ];

    return (
        <InfoScreen
            child1={onOffFacebookInfoText[0]}
            child2={onOffFacebookInfoText[1]}
        />
    );
};

export default OnOffFacebookInfoScreen;
