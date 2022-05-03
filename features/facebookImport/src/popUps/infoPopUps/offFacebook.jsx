import React from "react";

import i18n from "../../i18n.js";
import Infographic from "../../components/infographic/infographic.jsx";

const OffFacebookInfoPopUp = () => {
    return (
        <>
            <p>{i18n.t("offFacebookInfoScreen:text1")}</p>
            <div className="full-width">
                <Infographic
                    type="offFacebookBarChart"
                    texts={{
                        text1: i18n.t("infographics:offFacebookBarChart.text1"),
                        text2: i18n.t("infographics:offFacebookBarChart.text2"),
                        bigbold1: i18n.t(
                            "infographics:offFacebookBarChart.bigbold1"
                        ),
                        bold2_1: i18n.t(
                            "infographics:offFacebookBarChart.bold2"
                        ),
                        bold2_2: i18n.t(
                            "infographics:offFacebookBarChart.bold2"
                        ),
                        bold2_3: i18n.t(
                            "infographics:offFacebookBarChart.bold2"
                        ),
                        bold2_4: i18n.t(
                            "infographics:offFacebookBarChart.bold2"
                        ),
                    }}
                />
            </div>
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`offFacebookInfoScreen:text2`),
                }}
            />
            <div className="separator separator-space"></div>
            <h1 className="title title-space">
                {i18n.t("baseInfoScreen:title2")}
            </h1>
            <p>{i18n.t("offFacebookInfoScreen:text3")}</p>
            <p>{i18n.t("offFacebookInfoScreen:text4")}</p>
            <p>{i18n.t("offFacebookInfoScreen:text5")}</p>
            <p>{i18n.t("offFacebookInfoScreen:text6")}</p>
        </>
    );
};

export default OffFacebookInfoPopUp;
