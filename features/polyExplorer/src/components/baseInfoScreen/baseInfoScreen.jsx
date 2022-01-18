import React, { useContext } from "react";
import { ExplorerContext } from "../../context/explorer-context.jsx";

import i18n from "../../i18n.js";
import Screen from "../screen/screen.jsx";

import "./baseInfoScreen.css";

const BaseInfoScreen = ({ className, infoChildren }) => {
    const { handleBack } = useContext(ExplorerContext);
    return (
        <Screen className={className} light={true}>
            <div className="base-info">
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
                <button onClick={() => handleBack()}>
                    {i18n.t("common:button.ok")}
                </button>
            </div>
        </Screen>
    );
};

export default BaseInfoScreen;
