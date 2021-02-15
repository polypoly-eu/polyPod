import React from "react";
import "../screen.css";

const SharedWithCompaniesScreen = ({ company, onShowScreenChange }) => {
    return (
        <div className="explorer-container">
            <button onClick={() => onShowScreenChange("start", undefined)}>
                X
            </button>
            <h2>{company.name}</h2>
            <div className="shared-div">
                shares data with {company.sharedWithCompanies.length} companies
            </div>
        </div>
    );
};

export default SharedWithCompaniesScreen;
