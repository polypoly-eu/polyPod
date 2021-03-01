import React from "react";
import i18n from "../../../i18n.js";
import "../screen.css";

const SharedJurisdictionsScreen = ({ company }) => {
    return (
        <div className="explorer-container">
            <div className="screen-shadow"></div>
            <div className="screen-content">
                <h2>{company.name}</h2>
                <div className="shared-div">
                    {i18n.t("common:sharing.shares")}{" "}
                    {i18n.t("common:sharing.data")}{" "}
                    {i18n.t("common:sharing.in")}{" "}
                    {company.jurisdictionsShared.children.length}{" "}
                    {i18n.t("common:sharing.jurisdictions")}
                </div>
            </div>
        </div>
    );
};

export default SharedJurisdictionsScreen;
