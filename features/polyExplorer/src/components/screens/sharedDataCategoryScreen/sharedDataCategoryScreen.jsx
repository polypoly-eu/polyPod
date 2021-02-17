import React from "react";
import DataTypeBubbleCategory from "../../dataViz/dataTypeBubbleCategory.jsx";
import "../screen.css";
import "./sharedDataCategoryScreen.css";

const SharedDataTypeScreen = ({ company, onShowScreenChange }) => {
    /*const availableCategories = [
        "personalData",
        "socialData",
        "technicalData",
        "behavioralData",
        "financialData",
    ];*/

    return (
        <div className="explorer-container">
            <button onClick={() => onShowScreenChange("start", undefined)}>
                X
            </button>
            <h2>{company.name}</h2>
            <div>shares {company.dataTypesShared.length} datatypes</div>
            <div className="screen-content">
                <DataTypeBubbleCategory
                    data={company.dataTypesShared}
                    width="300"
                    height="400"
                    bubbleColor="#fe8988"
                />
            </div>
        </div>
    );
};

export default SharedDataTypeScreen;
