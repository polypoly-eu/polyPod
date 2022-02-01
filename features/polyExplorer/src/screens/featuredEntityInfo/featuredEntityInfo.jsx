import React from "react";

import i18n from "../../i18n.js";
import StoriesInfoScreen from "../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../components/infographic/infographic.jsx";

const FeaturedEntityInfoScreen = () => {
    const FeaturedEntityInfoScreenContent = [
        <div className="base-info-padding">
            <p>{i18n.t("featuredEntityInfoScreen:text.main")}</p>

            <Infographic
                type="featuredEntity"
                texts={{
                    highlighted1: i18n.t(
                        "infographic:featuredEntity.highlighted1"
                    ),
                    text1: i18n.t("infographic:featuredEntity.text1"),
                    text2: i18n.t("infographic:featuredEntity.text2"),
                    text3: i18n.t("infographic:featuredEntity.text3"),
                }}
            />

            <h4>{i18n.t("featuredEntityInfoScreen:headline.average")}</h4>
            <p>{i18n.t("featuredEntityInfoScreen:text.average")}</p>
            <h4>{i18n.t("featuredEntityInfoScreen:headline.total")}</h4>
            <p>{i18n.t("featuredEntityInfoScreen:text.total")}</p>
        </div>,
    ];
    return (
        <StoriesInfoScreen
            className="featured-entity-info-screen"
            infoChildren={FeaturedEntityInfoScreenContent}
        />
    );
};

export default FeaturedEntityInfoScreen;
