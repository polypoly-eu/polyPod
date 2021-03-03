import React from "react";

import Screen from "../../components/screen/screen.jsx";
import DataTypeBubbleCategory from "../../dataViz/dataTypeBubbleCategory.jsx";

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
        <Screen className="shared-data-category-screen">
            <h2>{company.name}</h2>
            <div>shares {company.dataTypesShared.length} datatypes</div>
            <DataTypeBubbleCategory
                data={company.dataTypesShared}
                width="300"
                height="400"
                bubbleColor="#fe8988"
            />
        </Screen>
    );
};

export default SharedDataCategoryScreen;
