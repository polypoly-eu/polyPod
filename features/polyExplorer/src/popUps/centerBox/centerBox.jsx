import React from "react";
import i18n from "../../i18n.js";

import "./centerBox.css";

const CenterBox = ({ content, onClose }) => {
    return (
        <div className="center-box-popup-container">
            <div className="center-box-popup">
                <h1>{content.headline}</h1>
                <p>{content.body}</p>
                <div></div>
                <button onClick={() => onClose()}>
                    {i18n.t("common:button.ok")}
                </button>
            </div>
        </div>
    );
};

export default CenterBox;
