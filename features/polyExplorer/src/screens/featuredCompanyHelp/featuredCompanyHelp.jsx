import React from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";

import "./featuredCompanyHelp.css";

const GaugeExplanationGraphic = () => (
    <div className="gauge-explanation-graphic">
        <span className="gauge-explanation-entries">
            {i18n.t("featuredCompanyHelpScreen:gaugeExplanation.entries")}
        </span>
        <span className="gauge-explanation-first">
            {i18n.t("featuredCompanyHelpScreen:gaugeExplanation.first")}
        </span>
        <img srcSet="images/gauge-explanation-2x.png 2x"></img>
        <span className="gauge-explanation-second">
            {i18n.t("featuredCompanyHelpScreen:gaugeExplanation.second")}
        </span>
        <span className="gauge-explanation-third">
            {i18n.t("featuredCompanyHelpScreen:gaugeExplanation.third")}
        </span>
        <span className="gauge-explanation-fourth">
            {i18n.t("featuredCompanyHelpScreen:gaugeExplanation.fourth")}
        </span>
    </div>
);

const FeaturedCompanyHelpScreen = ({ onClose }) => (
    <Screen className="featured-company-help-screen">
        <div className="featured-company-help-screen-content">
            <h1>{i18n.t("featuredCompanyHelpScreen:headline.main")}</h1>
            <p>{i18n.t("featuredCompanyHelpScreen:text.main")}</p>

            <GaugeExplanationGraphic />

            <h2>{i18n.t("featuredCompanyHelpScreen:headline.average")}</h2>
            <p>{i18n.t("featuredCompanyHelpScreen:text.average")}</p>

            <h2>{i18n.t("featuredCompanyHelpScreen:headline.total")}</h2>
            <p>{i18n.t("featuredCompanyHelpScreen:text.total")}</p>
        </div>

        <button onClick={onClose}>
            {i18n.t("featuredCompanyHelpScreen:button.explore")}
        </button>
    </Screen>
);

export default FeaturedCompanyHelpScreen;
