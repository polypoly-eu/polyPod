import React from "react";
//import DataTypeBubbles from "../dataViz/dataTypeBubbles.jsx";
import "../screen.css";

const SharedDataTypeScreen = ({ company, onShowScreenChange }) => {
    return (
        <div className="explorer-container">
            <button onClick={() => onShowScreenChange("start", undefined)}>
                X
            </button>
            <h2>{company.name}</h2>
            <div>shares {company.dataTypesShared.length} datatypes</div>
        </div>
    );
};
/* To return when d3 works
            <DataTypeBubbles
                data={company.sharedDataTypes}
                width="300"
                height="400"
                bubbleColor="#fe8988"
            />*/

export default SharedDataTypeScreen;
