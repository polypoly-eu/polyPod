import React, { useContext } from "react";
import { FacebookContext } from "../../../context/facebook-context.jsx";
import { IconButton } from "@polypoly-eu/poly-look";

import "./infoButton.css";

const InfoButton = ({ infoScreen }) => {
    const { setPopUp } = useContext(FacebookContext);

    return (
        <IconButton
            className="info-button"
            icon="question"
            fillDirection="left"
            onClick={() => setPopUp(infoScreen)}
        />
    );
};

export default InfoButton;
