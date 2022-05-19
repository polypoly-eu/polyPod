import React from "react";
import { IconButton } from "@polypoly-eu/poly-look";

import "./sourceInfoButton.css";

const SourceInfoButton = ({ source, infoScreen, stateChange, className }) => (
    <div className={`source-info-container ${className || ""}`}>
        <p className="source">{source}</p>
        <Icon infoScreen={infoScreen} stateChange={stateChange} />
    </div>
);

export default SourceInfoButton;
