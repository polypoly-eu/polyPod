import React from "react";

import "./dialog.css";

const Dialog = ({ title, message, backButton, proceedButton }) => {
    return (
        <div className="poly-dialog">
            <div className="poly-dialog-window">
                {title ? <h2>{title}</h2> : null}
                {message ? <p>{message}</p> : null}
                {backButton ? (
                    <button className="btn back" onClick={backButton.onClick}>
                        {backButton.text}
                    </button>
                ) : null}
                <button className="btn proceed" onClick={proceedButton.onClick}>
                    {proceedButton.text}
                </button>
            </div>
        </div>
    );
};

export default Dialog;
