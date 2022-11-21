import React from "react";

import i18n from "!silly-i18n";
import Infographic from "../../components/infographic/infographic.jsx";

import "./infoPopUps.css";

const DataStructureInfoPopUp = () => {
    return (
        <>
            <p>{i18n.t("dataStructureInfoScreen:text1")}</p>
            <div className="legend chart-description-title">
                {i18n.t("dataStructureInfoScreen:legend")}
            </div>
            <div className="full-width">
                <Infographic
                    type="bubblesChartInfoScreen"
                    texts={{
                        text1: i18n.t(
                            "infographics:bubblesChartInfoScreen.text1"
                        ),
                        text2: i18n.t(
                            "infographics:bubblesChartInfoScreen.text2"
                        ),
                    }}
                />
            </div>
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`dataStructureInfoScreen:text2`),
                }}
            />
            <div className="separator separator-space"></div>
            <h2 className="title title-space">
                {i18n.t("baseInfoScreen:title2")}
            </h2>
            <p>{i18n.t("dataStructureInfoScreen:text3")}</p>
        </>
    );
};

export default DataStructureInfoPopUp;
