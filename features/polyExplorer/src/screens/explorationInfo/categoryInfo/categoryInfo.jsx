import React from "react";

import i18n from "../../../i18n.js";
import ExplorationInfoScreen from "../../../components/explorationInfoScreen/explorationInfoScreen.jsx";

const CategoryInfo = ({ onClose }) => {
    return (
        <ExplorationInfoScreen
            className="category-info"
            headline={i18n.t("explorationCategoryInfoScreen:headline")}
            onClose={onClose}
        >
            <p>Dieser Bereich ist noch nicht fertig.</p>
            <img src="images/construction.gif"></img>
        </ExplorationInfoScreen>
    );
};

export default CategoryInfo;
