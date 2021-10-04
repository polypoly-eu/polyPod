import React from "react";
import RouteButton from "../routeButton.jsx";
import "./infoButton.css";

const InfoButton = ({ route, stateChange = null }) => (
    <RouteButton
        className="info-button"
        route={route}
        stateChange={stateChange}
    >
        <img src="./images/question.svg"></img>
    </RouteButton>
);

export default InfoButton;
