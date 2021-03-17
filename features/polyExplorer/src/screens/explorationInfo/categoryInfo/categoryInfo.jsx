import React from "react";

import Screen from "../../../components/screen/screen.jsx";

const CategoryInfo = ({ onClose }) => {
    return (
        <Screen className="category-info" light={true}>
            <button onClick={() => onClose()}>back</button>
        </Screen>
    );
};

export default CategoryInfo;
