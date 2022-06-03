import React, { useContext } from "react";

import { IconButton } from "@polypoly-eu/poly-look";
import { WhatsAppContext } from "../../context/whats-app-context.jsx";

import "./sourceInfoButton.css";

const SourceInfoButton = ({ source, className, popUpProps }) => {
    const { setPopUp } = useContext(WhatsAppContext);

    return (
        <div className={`source-info-container ${className || ""}`}>
            <p className="poly-small-print">Source: {source}</p>
            <IconButton
                icon="question"
                fillDirection="left"
                onClick={() => setPopUp(popUpProps)}
            />
        </div>
    );
};

export default SourceInfoButton;
