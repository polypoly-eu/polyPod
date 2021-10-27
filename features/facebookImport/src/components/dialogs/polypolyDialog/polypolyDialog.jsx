import React from "react";

import RouteButton from "../../buttons/routeButton.jsx";

import "./polypolyDialog.css";

const PolypolyDialog = ({ message, backButton, proceedButton }) => {
    return (
        <div className="polypoly-dialog">
            <div className="polypoly-dialog-window">
                <p>{message}</p>
                <button className="btn back" onClick={backButton.onClick}>
                    {backButton.text}
                </button>
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
