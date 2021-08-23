import React from "react";

import "./infoBox.css";

const InfoBox = ({ textContent }) => {
    return (
        <div className="infobox">
            <img src="./images/info-circle.svg" alt="" className="icon" />
            <div className="text-content">{textContent}</div>
        </div>
    );
};

export default InfoBox;
