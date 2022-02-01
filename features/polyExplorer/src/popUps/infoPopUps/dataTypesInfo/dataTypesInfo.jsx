import React from "react";

import i18n from "../../../i18n.js";
import BaseInfoPopUp from "../../../components/baseInfoPopUp/baseInfoPopUp.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const DataTypesInfo = () => {
    return (
        <BaseInfoPopUp
            className="data-types-info"
            headline={i18n.t("explorationDataTypesInfoScreen:headline")}
        >
            <div className="base-info-padding">
                <p>{i18n.t("explorationDataTypesInfoScreen:text.1")}</p>
                <Infographic
                    type="dataTypes"
                    texts={{
                        text1: i18n.t("infographic:dataTypes.text1"),
                        text2: i18n.t("infographic:dataTypes.text2"),
                        text3: i18n.t("infographic:dataTypes.text3"),
                    }}
                />
                <h2>{i18n.t("explorationDataTypesInfoScreen:subheading.1")}</h2>
                <p>{i18n.t("explorationDataTypesInfoScreen:text.2")}</p>
            </div>
        </BaseInfoPopUp>
    );
};

export default DataTypesInfo;
