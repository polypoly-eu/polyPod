import React from "react";
import "../screen.css";

const SharedPurposeScreen = ({ company }) => {
    return (
        <div className="explorer-container">
            <div className="screen-shadow"></div>
            <div className="screen-content">
                <h2>{company.name}</h2>
                <div className="shared-div">
                    shares {company.dataSharingPurposes.length} datatypes
                </div>
            </div>
        </div>
    );
};

export default SharedPurposeScreen;
