import React from "react";

import i18n from "../../i18n.js";
// import Screen from "../../components/screen/screen.jsx";
import InfoScreen from "../../components/infoScreen/infoScreen.jsx";

import "./featuredCompanyInfo.css";

const GaugeExplanationGraphic = () => (
    <div className="gauge-explanation-graphic">
        <span className="gauge-explanation-entries">
            {i18n.t("featuredCompanyInfoScreen:gaugeExplanation.entries")}
        </span>
        <span className="gauge-explanation-first">
            {i18n.t("featuredCompanyInfoScreen:gaugeExplanation.first")}
        </span>
        <img srcSet="images/gauge-explanation-2x.png 2x"></img>
        <span className="gauge-explanation-second">
            {i18n.t("featuredCompanyInfoScreen:gaugeExplanation.second")}
        </span>
        <span className="gauge-explanation-third">
            {i18n.t("featuredCompanyInfoScreen:gaugeExplanation.third")}
        </span>
        <span className="gauge-explanation-fourth">
            {i18n.t("featuredCompanyInfoScreen:gaugeExplanation.fourth")}
        </span>
    </div>
);

const FeaturedCompanyInfoScreen = ({ onClose }) => {
    return (
        <InfoScreen
            className="featured-company-info-screen"
            headline={i18n.t("featuredCompanyInfoScreen:headline.main")}
            onClose={onClose}
        >
            <p>{i18n.t("featuredCompanyInfoScreen:text.main")}</p>
            <GaugeExplanationGraphic />
            <h2>{i18n.t("featuredCompanyInfoScreen:headline.average")}</h2>
            <p>{i18n.t("featuredCompanyInfoScreen:text.average")}</p>
            <h2>{i18n.t("featuredCompanyInfoScreen:headline.total")}</h2>
            <p>{i18n.t("featuredCompanyInfoScreen:text.total")}</p>
        </InfoScreen>
    );
};

// const FeaturedCompanyInfoScreen = ({ onClose }) => (
//     <Screen className="featured-company-info-screen" light={true}>
//         <div className="featured-company-info-screen-content">
//             <h1>{i18n.t("featuredCompanyInfoScreen:headline.main")}</h1>
//             <p>{i18n.t("featuredCompanyInfoScreen:text.main")}</p>

//             <GaugeExplanationGraphic />

//             <h2>{i18n.t("featuredCompanyInfoScreen:headline.average")}</h2>
//             <p>{i18n.t("featuredCompanyInfoScreen:text.average")}</p>

//             <h2>{i18n.t("featuredCompanyInfoScreen:headline.total")}</h2>
//             <p>{i18n.t("featuredCompanyInfoScreen:text.total")}</p>
//         </div>

//         <button onClick={onClose}>
//             {i18n.t("featuredCompanyInfoScreen:button.explore")}
//         </button>
//     </Screen>
// );

export default FeaturedCompanyInfoScreen;
