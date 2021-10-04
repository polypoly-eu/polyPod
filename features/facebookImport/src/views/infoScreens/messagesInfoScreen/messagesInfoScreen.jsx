import React from "react";

import i18n from "../../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";

const MessagesScreen = () => {
    const messagesInfoText = [
        <>
            <p>{i18n.t("messagesInfoScreen:text1")}</p>
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`messagesInfoScreen:text2`),
                }}
            />
        </>,
        <p>{i18n.t("messagesInfoScreen:text3")}</p>,
    ];

    return (
        <InfoScreen child1={messagesInfoText[0]} child2={messagesInfoText[1]} />
    );
};

export default MessagesScreen;
