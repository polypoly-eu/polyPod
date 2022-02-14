import React, { useContext } from "react";

import i18n from "../../../i18n.js";
import highlights from "../../../data/highlights.js";
import globals from "../../../data/global.json";
import BaseInfoPopUp from "../baseInfoPopUp/baseInfoPopUp.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";
import { ExplorerContext } from "../../../context/explorer-context.jsx";

const CategoryInfo = () => {
    const { selectedEntityObject, navigationState } =
        useContext(ExplorerContext);
    const entity = selectedEntityObject;
    const activeCategory = navigationState.explorationState.category;
    const capitalizeCountryCode = i18n.t("common:country.code").toUpperCase();
    const description = "Description_" + capitalizeCountryCode;

    return (
        <BaseInfoPopUp
            className="category-info"
            headline={i18n.t("explorationCategoryInfoScreen:headline")}
        >
            <div className="base-info-padding">
                <p>
                    {
                        globals.polypoly_parent_categories[activeCategory][
                            description
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
                {highlights[entity.ppid].dataTypeCategories[activeCategory]
                    .explanation ? (
                    <div>
                        <h2>
                            {i18n.t("explorationCategoryInfoScreen:subheading")}
                        </h2>
                        <p>
                            {
                                highlights[entity.ppid].dataTypeCategories[
                                    activeCategory
                                ].explanation[i18n.t("common:country.code")]
                            }
                        </p>
                    </div>
                ) : null}
            </div>
        </BaseInfoPopUp>
    );
};

export default CategoryInfo;
