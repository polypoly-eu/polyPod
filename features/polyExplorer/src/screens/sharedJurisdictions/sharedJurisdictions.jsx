import React from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";

const SharedJurisdictionsScreen = ({ company }) => {
    return (
        <Screen className="shared-jurisdictions-screen">
            <h2>{company.name}</h2>
            <div className="shared-div">
                {i18n.t("common:sharing.detailPrefix.jurisdictions")}{" "}
                {company.jurisdictionsShared.children.length}{" "}
                {i18n.t("common:sharing.jurisdictions")}
            </div>
        </Screen>
    );
};

export default SharedJurisdictionsScreen;
