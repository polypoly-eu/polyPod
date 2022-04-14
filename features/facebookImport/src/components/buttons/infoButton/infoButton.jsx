import React, { useContext } from "react";
import { ImporterContext } from "../../../context/importer-context.jsx";

import "./infoButton.css";

const InfoButton = ({ infoScreen }) => {
    const { createPopUp } = useContext(ImporterContext);

    const handleClick = () => {
        createPopUp({ type: infoScreen });
    };

    <button className="info-button" onClick={handleClick}>
        <img src="./images/question.svg"></img>
    </button>;
};

export default InfoButton;
