import React from "react";

import { IconButton } from "@polypoly-eu/poly-look";

import "./sourceInfoButton.css";

const SourceInfoButton = ({ source, className }) => (
    <div className={`source-info-container ${className || ""}`}>
        <p className="poly-small-print">Source: {source}</p>
        <IconButton icon="question" fillDirection="left" />
    </div>
);

export default SourceInfoButton;
