import React from "react";

import i18n from "../../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";

const PicturesInfoScreen = () => {
    const picturesInfoText = [
        <>
            <p>{i18n.t("picturesInfoScreen:text1")}</p>
            <p>{i18n.t("picturesInfoScreen:text2")}</p>
        </>,
        <p>{i18n.t("picturesInfoScreen:text3")}</p>,
    ];

    return (
        <InfoScreen child1={picturesInfoText[0]} child2={picturesInfoText[1]} />
    );
};

export default PicturesInfoScreen;
