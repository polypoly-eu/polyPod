import React from "react";
import i18n from "../../i18n.js";
import "./onboardingPopup.css";

const OnboardingPopup = ({ onClose, onMoreInfo }) => {
    return (
        <div className="onboarding-popup-container">
            <div className="onboarding-popup">
                <div className="onboarding-popup-content">
                    <img src="images/onboarding-dialog.svg"></img>
                    <h1>{i18n.t("onboardingPopup:title")}</h1>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: i18n.t("onboardingPopup:text"),
                        }}
                    ></div>
                    <div className="fade-out"></div>
                </div>
                <div className="button-container">
                    <a onClick={onMoreInfo}>
                        {i18n.t("onboardingPopup:button.learnMore")}
                    </a>
                    <button onClick={onClose}>
                        {i18n.t("onboardingPopup:button.ok")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPopup;
