import React, { useContext } from "react";
import { ImporterContext } from "../../context/importer-context.jsx";

import i18n from "../../i18n.js";

import "./baseInfoPopUp.css";

const BaseInfoPopUp = ({ infoChildren }) => {
    const { handleBack } = useContext(ImporterContext);

    return (
        <div className="base-info">
            {infoChildren.map((infoChild, i) => (
                <div key={i}>
                    <div
                        className={i === 1 ? "info-title about" : "info-title"}
                    >
                        <img src="./images/line-title.svg" />
                        <h1>{i18n.t(`baseInfoScreen:title${i + 1}`)}</h1>
                        <img src="./images/line-title.svg" />
                    </div>
                    {infoChild}
                </div>
            ))}
            <button onClick={() => handleBack()}>
                {i18n.t("common:button.ok")}
            </button>
        </div>
    );
};

export default BaseInfoPopUp;
