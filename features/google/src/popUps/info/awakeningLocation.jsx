import React from "react";
import i18n from "!silly-i18n";

const AwakeningLocation = () => {
    return (
        <>
            <p>{i18n.t("awakeningLocationInfoScreen:text1")}</p>
            <div className="poly-separator separator-space"></div>
            <h1 className="about-title">
                {i18n.t("commonInfoScreen:baseInfo.title2")}
            </h1>
            <p>{i18n.t("awakeningLocationInfoScreen:text2")}</p>
            <p>{i18n.t("awakeningLocationInfoScreen:text3")}</p>
        </>
    );
};

export default AwakeningLocation;
