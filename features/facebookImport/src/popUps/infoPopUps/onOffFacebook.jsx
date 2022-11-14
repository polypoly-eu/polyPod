import React from "react";

import i18n from "!silly-i18n";
import Infographic from "../../components/infographic/infographic.jsx";

const OnOffFacebookInfoPopUp = () => {
    return (
        <>
            <p>{i18n.t("onOffFacebookInfoScreen:text1")}</p>
            <div className="full-width">
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
            </div>
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`onOffFacebookInfoScreen:text2`),
                }}
            />
            <p>{i18n.t("onOffFacebookInfoScreen:text3")}</p>
            <div className="separator separator-space"></div>
            <h2 className="title title-space">
                {i18n.t("baseInfoScreen:title2")}
            </h2>
            <p>{i18n.t("onOffFacebookInfoScreen:text4")}</p>
            <p>{i18n.t("onOffFacebookInfoScreen:text5")}</p>
            <p>{i18n.t("onOffFacebookInfoScreen:text6")}</p>
            <p>{i18n.t("onOffFacebookInfoScreen:text7")}</p>
            <p>{i18n.t("onOffFacebookInfoScreen:text8")}</p>
            <p>{i18n.t("onOffFacebookInfoScreen:text9")}</p>
        </>
    );
};

export default OnOffFacebookInfoPopUp;
