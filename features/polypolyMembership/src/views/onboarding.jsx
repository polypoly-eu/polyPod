import React from "react";
import { Screen, PolyButton, FixedFooter } from "@polypoly-eu/poly-look";
import i18n from "!silly-i18n";

import "./onboarding.css";

const Onboarding = () => {
    const handleOpenUrl = () => {
        window.pod.polyNav.openUrl(
            "https://polypoly-citizens.eu/en/becomepart"
        );
    };
    return (
        <Screen className="onboarding" layout="poly-standard-layout">
            <h1>{i18n.t("onboarding:title")}</h1>
            <p>{i18n.t("onboarding:text")}</p>
            <FixedFooter>
                <img src="" alt="" />
                <PolyButton label={i18n.t("onboarding:primary.button")} />
                <div className="secondary-link" onClick={handleOpenUrl()}>
                    <u>{i18n.t("onboarding:secondary.button")}</u>
                </div>
            </FixedFooter>
        </Screen>
    );
};

export default Onboarding;
