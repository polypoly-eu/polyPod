import React, { useContext } from "react";

import i18n from "../../../i18n.js";
import highlights from "../../../data/highlights.js";
import globals from "../../../data/global.json";
import BaseInfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";
import { ExplorerContext } from "../../../context/explorer-context.jsx";

const CategoryInfo = () => {
    const { selectedCompanyObject, navigationState } = useContext(
        ExplorerContext
    );
    const company = selectedCompanyObject;
    const activeCategory = navigationState.explorationState.category;

    return (
        <BaseInfoScreen
            className="category-info"
            headline={i18n.t("explorationCategoryInfoScreen:headline")}
        >
            <div className="base-info-padding">
                <p>
                    {
                        globals.polypoly_parent_categories[activeCategory][
                            i18n.t(
                                "dataExplorationScreen:from.polyPedia.description"
                            )
                        ]
                    }
                </p>
                <Infographic
                    type="category"
                    texts={{
                        text1: i18n.t("infographic:category.text1"),
                        text2: i18n.t("infographic:category.text2"),
                        text3: i18n.t("infographic:category.text3"),
                    }}
                />
                {highlights[company.ppid].dataTypeCategories[activeCategory]
                    .explanation ? (
                    <div>
                        <h2>
                            {i18n.t("explorationCategoryInfoScreen:subheading")}
                        </h2>
                        <p>
                            {
                                highlights[company.ppid].dataTypeCategories[
                                    activeCategory
                                ].explanation[i18n.t("common:country.code")]
                            }
                        </p>
                    </div>
                ) : null}
            </div>
        </BaseInfoScreen>
    );
};

export default CategoryInfo;
