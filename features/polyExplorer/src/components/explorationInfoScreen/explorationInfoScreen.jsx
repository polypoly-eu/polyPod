import React from "react";

import i18n from "../../i18n.js";
import Screen from "../screen/screen.jsx";

import "./explorationInfoScreen.css";

const ExplorationInfoScreen = ({ className, headline, onClose, children }) => (
    <Screen className={className} light={true}>
        <div className="exploration-info">
            <h1>{headline}</h1>
            {children}
            <button onClick={() => onClose()}>
                {i18n.t("explorationInfo:button.close")}
            </button>
        </div>
    </Screen>
);

export default ExplorationInfoScreen;
