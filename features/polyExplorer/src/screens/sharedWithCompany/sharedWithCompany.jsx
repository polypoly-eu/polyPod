import React from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";

const SharedWithCompaniesScreen = ({ company }) => {
    return (
        <Screen className="shared-with-companies-screen">
            <h2>{company.name}</h2>
            <div className="shared-div">
                {i18n.t("common:sharing.detailPrefix.companies")}{" "}
                {company.sharedWithCompanies.length}{" "}
                {i18n.t("common:sharing.companies")}
            </div>
        </Screen>
    );
};

export default SharedWithCompaniesScreen;
