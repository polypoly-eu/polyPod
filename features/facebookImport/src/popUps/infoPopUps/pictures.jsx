import React from "react";
import i18n from "../../i18n.js";

const PicturesInfoPopUp = () => {
    return (
        <>
            <p>{i18n.t("picturesInfoScreen:text1")}</p>
            <p>{i18n.t("picturesInfoScreen:text2")}</p>
            <div className="separator separator-space"></div>
            <h1 className="title title-space">
                {i18n.t("baseInfoScreen:title2")}
            </h1>
            <p>{i18n.t("picturesInfoScreen:text3")}</p>
        </>
    );
};

export default PicturesInfoPopUp;
