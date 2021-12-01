import React from "react";

import i18n from "../../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const MessagesScreen = () => {
    const messagesInfoText = [
        <>
            <p>{i18n.t("messagesInfoScreen:text1")}</p>
            <Infographic
                type="messagesBarChart"
                texts={{
                    text1: i18n.t("infographics:messagesBarChart.text1"),
                    text2: i18n.t("infographics:messagesBarChart.text2"),
                    bigbold1: i18n.t("infographics:messagesBarChart.bigbold1"),
                    bold2_1: i18n.t("infographics:messagesBarChart.bold2"),
                    bold2_2: i18n.t("infographics:messagesBarChart.bold2"),
                    bold2_3: i18n.t("infographics:messagesBarChart.bold2"),
                    bold2_4: i18n.t("infographics:messagesBarChart.bold2"),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`messagesInfoScreen:text2`),
                }}
            />
        </>,
        <p>{i18n.t("messagesInfoScreen:text3")}</p>,
    ];

    return <InfoScreen infoChildren={messagesInfoText} />;
};

export default MessagesScreen;
