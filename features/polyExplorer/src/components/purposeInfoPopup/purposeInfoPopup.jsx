import React from "react";
import i18n from "../../i18n.js";

import "./purposeInfoPopup.css";

const PurposeInfoPopup = ({ purpose, onClose }) => {
    return (
        <div className="purpose-info-popup-container">
            <div className="purpose-info-popup">
                <h1>{purpose.translation}</h1>
                <p>{purpose.explanation}</p>
                <div></div>
                <button onClick={() => onClose()}>
                    {i18n.t("common:button.ok")}
                </button>
            </div>
        </div>
    );
};

export default PurposeInfoPopup;
