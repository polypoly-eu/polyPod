import React from "react";

import i18n from "../../i18n.js";
import BaseInfoScreen from "../../components/baseInfoScreen/baseInfoScreen.jsx";
import Infographic from "../../components/infographic/infographic.jsx";

const FeaturedCompanyInfoScreen = ({ onClose }) => {
    return (
        <BaseInfoScreen
            className="featured-company-info-screen"
            headline={i18n.t("featuredCompanyInfoScreen:headline.main")}
            onClose={onClose}
        >
            <div className="base-info-padding">
                <p>{i18n.t("featuredCompanyInfoScreen:text.main")}</p>

                <Infographic
                    type="featuredCompany"
                    texts={{
                        highlighted1: i18n.t(
                            "infographic:featuredCompany.highlighted1"
                        ),
                        text1: i18n.t("infographic:featuredCompany.text1"),
                        text2: i18n.t("infographic:featuredCompany.text2"),
                        text3: i18n.t("infographic:featuredCompany.text3"),
                    }}
                />

                <h2>{i18n.t("featuredCompanyInfoScreen:headline.average")}</h2>
                <p>{i18n.t("featuredCompanyInfoScreen:text.average")}</p>
                <h2>{i18n.t("featuredCompanyInfoScreen:headline.total")}</h2>
                <p>{i18n.t("featuredCompanyInfoScreen:text.total")}</p>
            </div>
        </BaseInfoScreen>
    );
};

export default FeaturedCompanyInfoScreen;
