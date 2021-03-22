import React from "react";
import i18n from "../../i18n.js";

import "./purposeInfoPopup.css";

const PurposeInfoPopup = ({ purpose, onClose }) => {
    return (
        <div className="purpose-info-popup-container">
            <div className="purpose-info-popup">
                <h1>{purpose[i18n.t("common:purpose.name.i18nkey")]}</h1>
                <p>{purpose[i18n.t("common:purpose.description.i18nkey")]}</p>
                <div></div>
                <button onClick={() => onClose()}>
                    {i18n.t("common:button.ok")}
                </button>
            </div>
        </div>
    );
};

export default PurposeInfoPopup;
