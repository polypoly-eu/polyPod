import React from "react";
import LinkButton from "../linkButton/linkButton.jsx";
import "./infoButton.css";

const InfoButton = ({
    light = false,
    route,
    saveActiveIndex,
    stateChange = null,
}) => (
    <div onClick={saveActiveIndex}>
        <LinkButton
            className={light ? "info-button-light" : "info-button"}
            route={route}
            stateChange={stateChange}
        >
            <img
                src={
                    light
                        ? "images/question-light.svg"
                        : "images/question-dark.svg"
                }
            ></img>
        </LinkButton>
    </div>
);

export default InfoButton;
