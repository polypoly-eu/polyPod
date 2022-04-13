import React from "react";

import i18n from "../../../i18n.js";
import BaseInfoPopUp from "../../../components/baseInfoPopUp/baseInfoPopUp.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

import "../infoPopUps.css";

const DataStructureInfoScreen = () => {
    const dataStructureInfoText = [
        <>
            <p>{i18n.t("dataStructureInfoScreen:text1")}</p>
            <div className="legend chart-description-title">
                {i18n.t("dataStructureInfoScreen:legend")}
            </div>
            <Infographic
                type="bubblesChartInfoScreen"
                texts={{
                    text1: i18n.t("infographics:bubblesChartInfoScreen.text1"),
                    text2: i18n.t("infographics:bubblesChartInfoScreen.text2"),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`dataStructureInfoScreen:text2`),
                }}
            />
        </>,
        <p>{i18n.t("dataStructureInfoScreen:text3")}</p>,
    ];

    return <BaseInfoPopUp infoChildren={dataStructureInfoText} />;
};

export default DataStructureInfoScreen;
