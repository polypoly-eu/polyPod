import React from "react";

import i18n from "!silly-i18n";
import BaseInfoPopUp from "../baseInfoPopUp/baseInfoPopUp.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const FeaturedEntityInfoScreen = ({ onClose }) => {
    return (
        <BaseInfoPopUp
            className="featured-entity-info-screen"
            headline={i18n.t("featuredEntityInfoScreen:headline.main")}
            onClose={onClose}
        >
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

                <h2>{i18n.t("featuredEntityInfoScreen:headline.average")}</h2>
                <p>{i18n.t("featuredEntityInfoScreen:text.average")}</p>
                <h2>{i18n.t("featuredEntityInfoScreen:headline.total")}</h2>
                <p>{i18n.t("featuredEntityInfoScreen:text.total")}</p>
            </div>
        </BaseInfoPopUp>
    );
};

export default FeaturedEntityInfoScreen;
