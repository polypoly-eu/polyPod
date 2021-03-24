import React from "react";

import i18n from "../../../i18n.js";
import highlights from "../../../data/highlights.js";
import ExplorationInfoScreen from "../../../components/explorationInfoScreen/explorationInfoScreen.jsx";

const CategoryInfo = ({ category, company, onClose }) => {
    return (
        <ExplorationInfoScreen
            className="category-info"
            headline={i18n.t("explorationCategoryInfoScreen:headline")}
            onClose={onClose}
        >
            <p>
                {
                    highlights[company.name].dataTypeCategories[category]
                        .explanation[i18n.t("common:country.code")]
                }
            </p>
            <img
                src={`./images/infographics/category/${i18n.t(
                    "common:country.code"
                )}.svg`}
            />
            {highlights[company.name].dataTypeCategories[category]
                .highlightExplanation ? (
                <div>
                    <h2>{i18n.t("explorationCategoryInfoScreen")}</h2>
                    <p>
                        {
                            highlights[company.name].dataTypeCategories[
                                category
                            ].highlightExplanation[
                                i18n.t("common:country.code")
                            ]
                        }
                    </p>
                </div>
            ) : null}
        </ExplorationInfoScreen>
    );
};

export default CategoryInfo;
