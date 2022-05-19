import React from "react";

import InfoButton from "../buttons/infoButton/infoButton.jsx";

import "./sourceInfoButton.css";

const SourceInfoButton = ({ source, infoScreen, stateChange, className }) => (
    <div className={`source-info-container ${className || ""}`}>
        <p className="source">{source}</p>
        <InfoButton infoScreen={infoScreen} stateChange={stateChange} />
    </div>
);

export default SourceInfoButton;
