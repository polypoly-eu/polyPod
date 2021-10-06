import React from "react";

import i18n from "../../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";

const DataStructureInfoScreen = () => {
    const dataStructureInfoText = [
        <>
            <p>{i18n.t("dataStructureInfoScreen:text1")}</p>
            <p>
                <strong>{i18n.t("dataStructureInfoScreen:legend")}</strong>
            </p>
            <img
                className="infographic"
                src="./images/infographics/dataStructure.svg"
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
