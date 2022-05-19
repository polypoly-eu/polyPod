import React, { useContext } from "react";
import { GoogleContext } from "../context/google-context.jsx";
import popUps from "./";

const BasePopUp = ({}) => {
    const {
        popUp: { name, type = "side", ...props },
        closePopUp,
    } = useContext(GoogleContext);

    return <>{popUps[name]({ onClose: closePopUp, ...props })}</>;
};

export default BasePopUp;
