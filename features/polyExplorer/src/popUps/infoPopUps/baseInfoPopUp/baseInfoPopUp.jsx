import React, { useContext } from "react";
import { ExplorerContext } from "../../../context/explorer-context.jsx";

import i18n from "../../../i18n.js";

import "./baseInfoPopUp.css";

const BaseInfoPopUp = ({ className, headline, children }) => {
    const { closePopUp } = useContext(ExplorerContext);
    return (
        <div className={`base-info ${className}`}>
            <div className="base-info-padding">
                {headline && <h1>{headline}</h1>}
            </div>
            {children}
            <div className="base-info-padding">
                <button onClick={() => closePopUp()}>
                    {i18n.t("common:button.ok")}
                </button>
            </div>
        </div>
    );
};

export default BaseInfoPopUp;
