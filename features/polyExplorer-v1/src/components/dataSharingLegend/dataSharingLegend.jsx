import React from "react";
import i18n from "../../i18n.js";

const DataSharingLegend = ({ onClick }) => (
    <div className="data-sharing-legend" onClick={onClick}>
        <img src="images/question-circle.svg"></img>
        {i18n.t("featuredCompany:text.legend")}
    </div>
);

export default DataSharingLegend;
