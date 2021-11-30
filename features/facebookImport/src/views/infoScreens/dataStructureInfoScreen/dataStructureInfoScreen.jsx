import React from "react";

import i18n from "../../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const DataStructureInfoScreen = () => {
    const dataStructureInfoText = [
        <>
            <p>{i18n.t("dataStructureInfoScreen:text1")}</p>
            <p className="legend">
                <strong>{i18n.t("dataStructureInfoScreen:legend")}</strong>
            </p>
            <Infographic
                type="dataStructureBubbles"
                texts={{
                    text1: i18n.t("infographics:dataStructureBubbles.text1"),
                    text2: i18n.t("infographics:dataStructureBubbles.text2"),
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

    return (
        <InfoScreen
            child1={dataStructureInfoText[0]}
            child2={dataStructureInfoText[1]}
        />
    );
};

export default DataStructureInfoScreen;
