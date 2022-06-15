import React, { useContext } from "react";

import i18n from "!silly-i18n";

import { IconButton } from "@polypoly-eu/poly-look";
import { GoogleContext } from "../../context/google-context.jsx";

import "./sourceInfoButton.css";

const SourceInfoButton = ({ source, className, popUpProps }) => {
    const { setPopUp } = useContext(GoogleContext);

    return (
        <div className={`source-info-container ${className || ""}`}>
            <p className="poly-small-print">
                {i18n.t("common:source")}: {source}
            </p>
            <IconButton
                icon="question"
                fillDirection="left"
                onClick={() => setPopUp(popUpProps)}
            />
        </div>
    );
};

export default SourceInfoButton;
