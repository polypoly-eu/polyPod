import { BaseOverlay, PolyButton } from "@polypoly-eu/poly-look";
import React from "react";

import "./dialog.css";

const Dialog = ({ title, message, backButton, proceedButton }) => {
    return (
        <BaseOverlay opaque={true} className="poly-content-centered">
            <div className="poly-dialog-window poly-theme-light poly-standard-layout">
                {title ? <h2>{title}</h2> : null}
                {message ? <p>{message}</p> : null}
                {backButton ? (
                    <PolyButton
                        onClick={backButton.onClick}
                        label={backButton.text}
                        type="outline"
                    />
                ) : null}
                <PolyButton
                    onClick={proceedButton.onClick}
                    label={proceedButton.text}
                />
            </div>
        </BaseOverlay>
    );
};

export default Dialog;
