import React from "react";

import "./constructionPopup.css";

const ConstructionPopup = ({ onClose }) => {
    return (
        <div className="construction-popup-container">
            <div className="construction-popup">
                <img src="./images/construction.gif" />
                <button onClick={onClose}>Ok</button>
            </div>
        </div>
    );
};

export default ConstructionPopup;
