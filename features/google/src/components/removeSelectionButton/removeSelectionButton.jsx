import React from "react";

import "./removeSelectionButton.css";

const RemoveSelectionButton = ({ onClick }) => {
    return (
        <button className="remove-selection-button" onClick={onClick}>
            <img src="./images/ic-delete-left-1.svg" alt="" className="icon" />
        </button>
    );
};

export default RemoveSelectionButton;
