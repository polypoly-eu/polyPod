import React, { useContext } from "react";
import { ExplorerContext } from "../../../context/explorer-context.jsx";
import "./infoButton.css";

const InfoButton = ({ infoScreen, stateChange }) => {
    const { changeNavigationState, throwPopUp } = useContext(ExplorerContext);

    console.log(infoScreen);

    const handleClick = () => {
        if (stateChange) changeNavigationState(stateChange);
        throwPopUp({ type: infoScreen });
    };

    return (
        <button className="info-button" onClick={handleClick}>
            <img src="images/question-info.svg"></img>
        </button>
    );
};

export default InfoButton;
