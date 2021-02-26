import React from "react";
import "../screen.css";

const SharedPurposeScreen = ({ company }) => {
    return (
        <div className="explorer-container">
            <h2>{company.name}</h2>
            <div className="shared-div">
                shares {company.dataSharingPurposes.length} datatypes
            </div>
        </div>
    );
};

export default SharedPurposeScreen;
