import React from "react";

import i18n from "../../../i18n.js";
import InfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";

import "./postReactionInfoScreen.css";

const PostReactionInfoScreen = () => {
    const postReactionInfoText = [
        <>
            <p>{i18n.t("postReactionInfoScreen:text1")}</p>
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`postReactionInfoScreen:text2`),
                }}
            />
        </>,
        <p> </p>,
    ];

    return (
        <div className="reaction-types-info">
            <InfoScreen infoChildren={postReactionInfoText} />
        </div>
    );
};

export default PostReactionInfoScreen;
