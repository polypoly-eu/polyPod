import React from "react";
import RouteButton from "../routeButton.jsx";
import "./infoButton.css";

const InfoButton = ({
    route,
    // saveActiveIndex,
    stateChange = null,
}) => (
    <div
    // onClick={saveActiveIndex}
    >
        <RouteButton
            className="info-button"
            route={route}
            stateChange={stateChange}
        >
            <img src="./images/question.svg"></img>
        </RouteButton>
    </div>
);

export default InfoButton;
