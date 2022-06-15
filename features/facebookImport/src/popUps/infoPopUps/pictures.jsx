import React from "react";

import i18n from "!silly-i18n";
import BaseInfoPopUp from "../baseInfoPopUp/baseInfoPopUp.jsx";

const PicturesInfoPopUp = () => {
    const picturesInfoText = [
        <>
            <p>{i18n.t("picturesInfoScreen:text1")}</p>
            <p>{i18n.t("picturesInfoScreen:text2")}</p>
        </>,
        <p>{i18n.t("picturesInfoScreen:text3")}</p>,
    ];

    return <BaseInfoPopUp infoChildren={picturesInfoText} />;
};

export default PicturesInfoPopUp;
