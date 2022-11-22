import React from "react";

import i18n from "!silly-i18n";
import Infographic from "../../infographic/infographic.jsx";

import "./postReaction.css";
import "./infoPopUps.css";

const PostReactionInfoPopUp = () => {
    return (
        <div className="reaction-types-info">
            <p>{i18n.t("postReactionInfoScreen:text1")}</p>
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
                    __html: i18n.t(`postReactionInfoScreen:text2`),
                }}
            />
        </div>
    );
};

export default PostReactionInfoPopUp;
