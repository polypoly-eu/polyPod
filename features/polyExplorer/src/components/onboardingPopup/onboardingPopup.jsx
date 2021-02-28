import React from "react";
import i18n from "../../i18n.js";
import "./onboardingPopup.css";

const OnboardingPopup = ({ onCloseOnboardingPopup }) => {
    return (
        <div className="onboarding-popup-container">
            <div className="onboarding-popup">
                <div className="image-container"></div>
                <div className="text-container">
                    <h1>{i18n.t("onboardingPopup:title")}</h1>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: i18n.t("onboardingPopup:text"),
                        }}
                    ></div>
                </div>
                <div className="button-container">
                    <button onClick={() => onCloseOnboardingPopup()}>
                        {i18n.t("onboardingPopup:button.ok")}
                    </button>
                    <button>
                        {i18n.t("onboardingPopup:button.learnMore")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPopup;
