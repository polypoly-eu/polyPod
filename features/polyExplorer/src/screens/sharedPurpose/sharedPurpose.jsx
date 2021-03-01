import React from "react";
import i18n from "../../i18n.js";
import "../screen.css";

const SharedPurposeScreen = ({ company }) => {
    return (
        <div className="explorer-container">
            <h2>{company.name}</h2>
            <div className="shared-div">
                {i18n.t("common:sharing.shares")}{" "}
                {i18n.t("common:sharing.data")} {i18n.t("common:sharing.for")}{" "}
                {company.dataSharingPurposes.length}{" "}
                {i18n.t("common:sharing.purposes")}
            </div>
        </div>
    );
};

export default SharedPurposeScreen;
