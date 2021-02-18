import React from "react";
import "../screen.css";

const SharedJurisdictionsScreen = ({ company, onShowScreenChange }) => {
    return (
        <div className="explorer-container">
            <button onClick={() => onShowScreenChange("start", undefined)}>
                X
            </button>
            <h2>{company.name}</h2>
            <div className="shared-div">
                shares data with {company.jurisdictionsShared.children.length}{" "}
                companies
            </div>
        </div>
    );
};

export default SharedJurisdictionsScreen;
