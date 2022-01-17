import React from "react";
import LinkButton from "../linkButton/linkButton.jsx";
import "./infoButton.css";

const InfoButton = ({
    source,
    light = false,
    route,
    saveActiveIndex,
    stateChange = null,
}) => (
    <div onClick={saveActiveIndex} className="source-info-container">
        <p className="source">{source}</p>
        <LinkButton
            className={light ? "info-button-light" : "info-button"}
            route={route}
            stateChange={stateChange}
        >
            <img src="images/question-dark.svg"></img>
        </LinkButton>
    </div>
);

export default InfoButton;
