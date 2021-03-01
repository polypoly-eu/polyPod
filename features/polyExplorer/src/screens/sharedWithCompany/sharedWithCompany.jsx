import React from "react";
import i18n from "../../i18n.js";
import "../screen.css";

const SharedWithCompaniesScreen = ({ company }) => {
    return (
        <div className="explorer-container">
            <div className="screen-shadow"></div>
            <div className="screen-content">
                <h2>{company.name}</h2>
                <div className="shared-div">
                    {i18n.t("common:sharing.shares")}{" "}
                    {i18n.t("common:sharing.data")}{" "}
                    {i18n.t("common:sharing.with")}{" "}
                    {company.sharedWithCompanies.length}{" "}
                    {i18n.t("common:sharing.companies")}
                </div>
            </div>
        </div>
    );
};

export default SharedWithCompaniesScreen;
