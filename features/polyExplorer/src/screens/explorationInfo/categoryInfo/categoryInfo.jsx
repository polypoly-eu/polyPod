import React from "react";

import i18n from "../../../i18n.js";
import highlights from "../../../data/highlights.js";
import globals from "../../../data/global.json";
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
                    globals.polypoly_parent_categories[category][
                        i18n.t(
                            "dataExplorationScreen:from.polyPedia.description"
                        )
                    ]
                }
            </p>
            <img
                src={`./images/infographics/category/${i18n.t(
                    "common:country.code"
                )}.svg`}
            />
            {highlights[company.name].dataTypeCategories[category]
                .explanation ? (
                <div>
                    <h2>{i18n.t("explorationCategoryInfoScreen")}</h2>
                    <p>
                        {
                            highlights[company.name].dataTypeCategories[
                                category
                            ].explanation[i18n.t("common:country.code")]
                        }
                    </p>
                </div>
            ) : null}
        </ExplorationInfoScreen>
    );
};

export default CategoryInfo;
