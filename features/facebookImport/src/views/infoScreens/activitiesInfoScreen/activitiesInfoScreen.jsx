import React from "react";

import i18n from "../../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";

const ActivitiesInfoScreen = () => {
    const activitiesInfoText = [
        <>
            <p>{i18n.t("activitiesInfoScreen:text1")}</p>
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
