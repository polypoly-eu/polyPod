import React from "react";
import i18n from "../../i18n.js";
import LinkButton from "../linkButton/linkButton.jsx";

const DataSharingLegend = ({ route, stateChange }) => (
    <LinkButton
        route={route}
        className="data-sharing-legend"
        stateChange={stateChange}
    >
        <img src="images/question-circle.svg"></img>
        {i18n.t("featuredCompany:text.legend")}
    </LinkButton>
);

export default DataSharingLegend;
