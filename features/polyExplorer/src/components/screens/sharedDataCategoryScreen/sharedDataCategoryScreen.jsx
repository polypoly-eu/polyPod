import React from "react";
import DataTypeBubbleCategory from "../../dataViz/dataTypeBubbleCategory.jsx";
import "../screen.css";
import "./sharedDataCategoryScreen.css";

const SharedDataCategoryScreen = ({ company }) => {
    /*const availableCategories = [
        "personalData",
        "socialData",
        "technicalData",
        "behavioralData",
        "financialData",
    ];*/

    return (
        <div className="explorer-container">
            <div className="screen-shadow"></div>
            <div className="screen-content">
                <h2>{company.name}</h2>
                <div>shares {company.dataTypesShared.length} datatypes</div>

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

export default SharedDataCategoryScreen;
