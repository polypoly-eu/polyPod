import React from "react";
import { Screen, PolyButton, FixedFooter } from "@polypoly-eu/poly-look";
// import i18n from "!silly-i18n";

const Overview = () => {
    return (
        <Screen className="onboarding" layout="poly-standard-layout">
            <FixedFooter>
                <PolyButton label="Export data" />
            </FixedFooter>
        </Screen>
    );
};

export default Overview;
