import React from "react";

import i18n from "../../i18n.js";
import Screen from "../screen/screen.jsx";

import "./infoScreen.css";

const InfoScreen = ({ className, headline, onClose, children }) => (
    <Screen className={className} light={true}>
        <div className="exploration-info">
            <h1>{headline}</h1>
            {children}
            <button onClick={() => onClose()}>
                {i18n.t("common:button.ok")}
            </button>
        </div>
    </Screen>
);

export default InfoScreen;
