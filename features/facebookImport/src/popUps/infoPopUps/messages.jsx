import React from "react";

import i18n from "../../i18n.js";
import Infographic from "../../components/infographic/infographic.jsx";

const MessagesInfoPopUp = () => {
    return (
        <>
            <p>{i18n.t("messagesInfoScreen:text1")}</p>
            <div className="full-width">
                <Infographic
                    type="messagesBarChart"
                    texts={{
                        text1: i18n.t("infographics:messagesBarChart.text1"),
                        text2: i18n.t("infographics:messagesBarChart.text2"),
                        bigbold1: i18n.t(
                            "infographics:messagesBarChart.bigbold1"
                        ),
                        bold2_1: i18n.t("infographics:messagesBarChart.bold2"),
                        bold2_2: i18n.t("infographics:messagesBarChart.bold2"),
                        bold2_3: i18n.t("infographics:messagesBarChart.bold2"),
                        bold2_4: i18n.t("infographics:messagesBarChart.bold2"),
                    }}
                />
            </div>
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`messagesInfoScreen:text2`),
                }}
            />
            <div className="separator separator-space"></div>
            <h1 className="title title-space">
                {i18n.t("baseInfoScreen:title2")}
            </h1>
            <p>{i18n.t("messagesInfoScreen:text3")}</p>
        </>
    );
};

export default MessagesInfoPopUp;
