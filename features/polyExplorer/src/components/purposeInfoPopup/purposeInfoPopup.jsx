import React from "react";
//import i18n from "../../i18n.js";

import "./purposeInfoPopup.css";

const PurposeInfoPopup = ({ purpose, onClose }) => {
    return (
        <div className="purpose-info-popup-container">
            <div className="purpose-info-popup">
                <h1>Purpose info popup is here to explain purpose {purpose}</h1>
                <p>
                    A high-level Class to describe data handling. This can
                    consist of personal data being processed for a purpose,
                    involving entities, using technical and organisational,
                    applicable risks, rights, and legal basis.
                </p>
                <div></div>
                <button onClick={() => onClose()}>OK!</button>
            </div>
        </div>
    );
};

export default PurposeInfoPopup;
