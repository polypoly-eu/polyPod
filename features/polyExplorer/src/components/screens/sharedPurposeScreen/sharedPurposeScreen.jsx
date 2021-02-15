import React from "react";
import "../screen.css";

const SharedPurposeScreen = ({ company, onShowScreenChange }) => {
    return (
        <div className="explorer-container">
            <button onClick={() => onShowScreenChange("start", undefined)}>
                X
            </button>
            <h2>{company.name}</h2>
            <div className="shared-div">
                shares {company.dataSharingPurposes.length} datatypes
            </div>
        </div>
    );
};

export default SharedPurposeScreen;
