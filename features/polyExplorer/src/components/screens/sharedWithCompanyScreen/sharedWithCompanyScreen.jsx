import React from "react";
import "../screen.css";

const SharedWithCompaniesScreen = ({ company }) => {
    return (
        <div className="explorer-container">
            <h2>{company.name}</h2>
            <div className="shared-div">
                shares data with {company.sharedWithCompanies.length} companies
            </div>
        </div>
    );
};

export default SharedWithCompaniesScreen;
