import React from "react";

import RouteButton from "../../buttons/routeButton.jsx";

import "./polypolyDialog.css";

const PolypolyDialog = ({ title, message, backButton, proceedButton }) => {
    return (
        <div className="polypoly-dialog">
            <div className="polypoly-dialog-window">
                {title ? <h2>{title}</h2> : null}
                {message ? <p>{message}</p> : null}
                {backButton ? (
                    <button className="btn back" onClick={backButton.onClick}>
                        {backButton.text}
                    </button>
                ) : null}
                <RouteButton
                    className="btn proceed"
                    route={proceedButton.route}
                    stateChange={proceedButton.stateChange}
                    onClick={proceedButton.onClick}
                >
                    {proceedButton.text}
                </RouteButton>
            </div>
        </div>
    );
};

export default PolypolyDialog;
