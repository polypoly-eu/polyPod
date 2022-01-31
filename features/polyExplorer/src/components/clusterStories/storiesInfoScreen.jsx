import React, { useContext } from "react";
import { ExplorerContext } from "../../context/explorer-context.jsx";

import i18n from "../../i18n.js";

import "./storiesInfoScreen.css";

const StoriesInfoScreen = ({ className, infoChildren }) => {
    const { closePopUp } = useContext(ExplorerContext);
    return (
        <div className={`stories-info ${className}`}>
            {infoChildren.map((infoChild, i) => (
                <div key={i}>
                    <div className="info-title">
                        <div className="line"></div>
                        <h1>
                            {i18n.t(`commonInfoScreen:baseInfo.title${i + 1}`)}
                        </h1>
                        <div className="line"></div>
                    </div>
                    {infoChild}
                </div>
            ))}
            <div className="stories-info-padding">
                <button onClick={closePopUp}>
                    {i18n.t("common:button.ok")}
                </button>
            </div>
        </div>
    );
};

export default StoriesInfoScreen;
