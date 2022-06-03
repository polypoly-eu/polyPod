import React, { useContext } from "react";
import { WhatsAppContext } from "../context/whats-app-context.jsx";
import popUps from "./";
import BaseInfoPopUp from "./info/base.jsx";

const infoPrefix = "info-";

const BasePopUp = () => {
    const {
        popUp: { name, ...props },
        closePopUp,
    } = useContext(WhatsAppContext);

    if (name.startsWith(infoPrefix))
        return <BaseInfoPopUp onClose={closePopUp} name={name} />;

    return <>{popUps[name]({ onClose: closePopUp, ...props })}</>;
};

export default BasePopUp;
