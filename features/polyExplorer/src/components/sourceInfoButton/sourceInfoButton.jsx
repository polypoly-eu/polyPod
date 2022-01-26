import React from "react";

import InfoButton from "../buttons/infoButton/infoButton.jsx";

import "./sourceInfoButton.css";

export default function SourceInfoButton({
    source,
    saveActiveIndex,
    infoScreenRoute,
    stateChange,
}) {
    return (
        <div className="source-info-container">
            <p className="source">{source}</p>
            <InfoButton
                infoScreenRoute={infoScreenRoute}
                saveActiveIndex={saveActiveIndex}
                stateChange={stateChange}
            />
        </div>
    );
}
