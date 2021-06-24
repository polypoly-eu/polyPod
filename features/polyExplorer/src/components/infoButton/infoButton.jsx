import React from "react";
import "./infoButton.css";

const InfoButton = ({ light = false, onClick }) => (
    <div
        className={light ? "info-button-light" : "info-button"}
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
