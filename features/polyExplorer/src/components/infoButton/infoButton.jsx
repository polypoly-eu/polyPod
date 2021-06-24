import React from "react";
import "./infoButton.css";

const InfoButton = ({ light = false, onClick }) => (
    <div
        className={light ? "data-sharing-legend-light" : "data-sharing-legend"}
        onClick={onClick}
    >
        <img
            src={
                light ? "images/question-light.svg" : "images/question-dark.svg"
            }
        ></img>
    </div>
);

export default InfoButton;
