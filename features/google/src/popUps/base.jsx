import React, { useContext } from "react";
import { GoogleContext } from "../context/google-context.jsx";
import popUps from "./";
import BaseInfoPopUp from "./info/base.jsx";

const infoPrefix = "info-";

const BasePopUp = () => {
    const {
        popUp: { name, ...props },
        closePopUp,
    } = useContext(GoogleContext);

    if (name.startsWith(infoPrefix))
        return <BaseInfoPopUp onClose={closePopUp} name={name} />;

    return <>{popUps[name]({ onClose: closePopUp, ...props })}</>;
};

export default BasePopUp;
