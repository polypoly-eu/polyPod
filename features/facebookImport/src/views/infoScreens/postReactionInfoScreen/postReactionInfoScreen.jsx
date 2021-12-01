import React from "react";

import i18n from "../../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

import "./postReactionInfoScreen.css";

const PostReactionInfoScreen = () => {
    const postReactionInfoText = [
        <>
            <p>{i18n.t("postReactionInfoScreen:text1")}</p>
            <p className="legend">
                <strong>{i18n.t("dataStructureInfoScreen:legend")}</strong>
            </p>
            <Infographic
                type="bubblesChartInfoScreen"
                texts={{
                    text1: i18n.t("infographics:bubblesChartInfoScreen.text1"),
                    text2: i18n.t("infographics:bubblesChartInfoScreen.text2"),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`postReactionInfoScreen:text2`),
                }}
            />
        </>,
    ];

    return (
        <div className="reaction-types-info">
            <InfoScreen infoChildren={postReactionInfoText} />
        </div>
    );
};

export default PostReactionInfoScreen;
