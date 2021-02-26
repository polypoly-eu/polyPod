import React from "react";
import DataTypeBubbles from "../../dataViz/dataTypeBubbles.jsx";
import "../screen.css";

const SharedDataTypeScreen = ({ company }) => {
    return (
        <div className="explorer-container">
            <div className="screen-shadow"></div>
            <div className="screen-content">
                <h2>{company.name}</h2>
                <div>
                    <p className="">shares</p>{" "}
                    <p>{company.dataTypesShared.length} datatypes</p>
                </div>

                <DataTypeBubbles
                    data={company.dataTypesShared}
                    width="300"
                    height="400"
                    bubbleColor="#FB8A89"
                    textColor="#0f1938"
                />
            </div>
        </div>
    );
};

export default SharedDataTypeScreen;
