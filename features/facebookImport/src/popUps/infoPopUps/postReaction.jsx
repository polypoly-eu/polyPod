import React from "react";

import i18n from "../../i18n.js";
import Infographic from "../../components/infographic/infographic.jsx";

import "./postReaction.css";
import "./infoPopUps.css";

const PostReactionInfoPopUp = () => {
    return (
        <div className="reaction-types-info">
            <p>{i18n.t("postReactionInfoScreen:text1")}</p>
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
                    __html: i18n.t(`postReactionInfoScreen:text2`),
                }}
            />
        </div>
    );
};

export default PostReactionInfoPopUp;
