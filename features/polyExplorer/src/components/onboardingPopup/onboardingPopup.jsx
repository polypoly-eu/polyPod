import React from "react";
import "./onboardingPopup.css";

const OnboardingPopup = ({ onCloseOnboardingPopup }) => {
    return (
        <div className="onboarding-popup-container">
            <div className="onboarding-popup">
                <div className="image-container"></div>
                <div className="text-container">
                    <h1>Data Background</h1>
                    <p>
                        Please note: Data used in this feature comes from
                        different sources.
                    </p>
                    <p>
                        Data about privacy behavior is our own research based on
                        policies provided on the german websites of featured
                        companies.
                    </p>
                    <p> Find more about our sources and process.</p>
                </div>
                <div className="button-container">
                    <button onClick={() => onCloseOnboardingPopup()}>Ok</button>
                    <button>Learn More</button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPopup;
