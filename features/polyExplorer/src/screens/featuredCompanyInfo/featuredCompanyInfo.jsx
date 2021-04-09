import React from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";
import Infographic from "../../components/infographic/infographic.jsx";

import "./featuredCompanyInfo.css";

const FeaturedCompanyInfoScreen = ({ onClose }) => (
    <Screen className="featured-company-info-screen" light={true}>
        <div className="featured-company-info-screen-content">
            <h1>{i18n.t("featuredCompanyInfoScreen:headline.main")}</h1>
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

        <button onClick={onClose}>
            {i18n.t("featuredCompanyInfoScreen:button.explore")}
        </button>
    </Screen>
);

export default FeaturedCompanyInfoScreen;
