import React from "react";

import i18n from "../../i18n.js";

import "./constructionPopup.css";

const ConstructionPopup = ({ onClose }) => {
    return (
        <div className="construction-popup-container">
            <div className="construction-popup">
                <img src="./images/construction.gif" />
                <button onClick={onClose}>
                    {i18n.t("onboardingPopup:button.ok")}
                </button>
            </div>
        </div>
    );
};

export default ConstructionPopup;
