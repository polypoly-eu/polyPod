import React, { useContext } from "react";
import { FacebookContext } from "../../../context/facebook-context.jsx";

import "./infoButton.css";

const InfoButton = ({ infoScreen }) => {
    const { createPopUp } = useContext(FacebookContext);

    const handleClick = () => {
        createPopUp({ type: infoScreen });
    };
    return (
        <button className="info-button" onClick={handleClick}>
            <img src="./images/question.svg"></img>
        </button>
    );
};

export default InfoButton;
