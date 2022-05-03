import React, { useContext } from "react";
import { ImporterContext } from "../../../context/importer-context.jsx";
import { IconButton } from "@polypoly-eu/poly-look";

import "./infoButton.css";

const InfoButton = ({ infoScreen }) => {
    const { setPopUp } = useContext(ImporterContext);

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
