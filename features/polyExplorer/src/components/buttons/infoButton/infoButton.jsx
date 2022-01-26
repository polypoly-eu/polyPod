import React from "react";
import LinkButton from "../linkButton/linkButton.jsx";
import "./infoButton.css";

const InfoButton = ({
    infoScreenRoute,
    saveActiveIndex,
    stateChange = null,
}) => (
    <div onClick={saveActiveIndex}>
        <LinkButton
            className="info-button"
            route={infoScreenRoute}
            stateChange={stateChange}
        >
            <img src="images/question-info.svg"></img>
        </LinkButton>
    </div>
);

export default InfoButton;
