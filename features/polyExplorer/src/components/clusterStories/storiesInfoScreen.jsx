import React, { useContext } from "react";
import { ExplorerContext } from "../../context/explorer-context.jsx";

import i18n from "../../i18n.js";
import Screen from "../screen/screen.jsx";

import "./storiesInfoScreen.css";

const StoriesInfoScreen = ({ className, infoChildren }) => {
    const { handleBack } = useContext(ExplorerContext);
    return (
        <Screen className={className} light={true}>
            <div className="stories-info">
                {infoChildren.map((infoChild, i) => (
                    <div key={i}>
                        <div className="info-title">
                            <div className="line"></div>
                            <h1>{i18n.t(`baseInfoScreen:title${i + 1}`)}</h1>
                            <div className="line"></div>
                        </div>
                        {infoChild}
                    </div>
                ))}
                <div className="stories-info-padding">
                    <button onClick={() => handleBack()}>
                        {i18n.t("common:button.ok")}
                    </button>
                </div>
            </div>
        </Screen>
    );
};

export default StoriesInfoScreen;
