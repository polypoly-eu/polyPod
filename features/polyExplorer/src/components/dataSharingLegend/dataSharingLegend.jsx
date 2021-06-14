import React from "react";
import "./dataSharingLegend.css";

const DataSharingLegend = ({ light = false, onClick }) => (
    <div className={light ? "data-sharing-legend-light" : "data-sharing-legend"} onClick={onClick}>
        <img src={light ? "images/question-light.svg" : "images/question-dark.svg"}></img>
    </div>
);

export default DataSharingLegend;
