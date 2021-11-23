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
