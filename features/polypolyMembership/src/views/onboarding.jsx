import React from "react";
import { Screen, PolyButton, FixedFooter } from "@polypoly-eu/poly-look";
import i18n from "!silly-i18n";

import "./onboarding.css";

const Onboarding = () => {
    const handleOpenUrl = () => {
        console.log("Link to https://polypoly-citizens.eu/en/becomepart");
        // This is "undefined" until we implement the navigation in the feature
        // window.pod.polyNav.openUrl("coop-become-part");
    };
    return (
        <Screen className="onboarding" layout="poly-standard-layout">
            <h1>{i18n.t("onboarding:title")}</h1>
            <p>{i18n.t("onboarding:text")}</p>
            <FixedFooter>
                <PolyButton label={i18n.t("onboarding:primary.button")} />
                <div className="secondary-link" onClick={handleOpenUrl()}>
                    <u>{i18n.t("onboarding:secondary.button")}</u>
                </div>
            </FixedFooter>
        </Screen>
    );
};

export default Onboarding;
