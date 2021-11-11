import React from "react";

import i18n from "../../i18n.js";
import Screen from "../screen/screen.jsx";

import "./baseInfoScreen.css";

const InfoScreen = ({ className, headline, onClose, children }) => (
    <Screen className={className} light={true}>
        <div className="base-info">
            <div className="base-info-padding">
                <h1>{headline}</h1>
            </div>
            {children}
            <div className="base-info-padding">
                <button onClick={() => onClose()}>
                    {i18n.t("common:button.ok")}
                </button>
            </div>
        </div>
    </Screen>
);

export default InfoScreen;
