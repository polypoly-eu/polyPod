import React from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";

const SharedPurposeScreen = ({ company }) => {
    return (
        <Screen className="shared-purpose-screen">
            <h2>{company.name}</h2>
            <div className="shared-div">
                {i18n.t("common:sharing.detailPrefix.purposes")}{" "}
                {company.dataSharingPurposes.length}{" "}
                {i18n.t("common:sharing.purposes")}
            </div>
        </Screen>
    );
};

export default SharedPurposeScreen;
