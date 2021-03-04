import React from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";

import "./dataRegionInfo.css";

const DataRegionInfo = () => {
    const locationTooltip = (
        <div className="location-tooltip">
            <p>{i18n.t("companyInfoScreen:jurisdictions")}</p>
            <div className="circle EU-GDPR"></div>
            <p>{i18n.t("common:jurisdiction.euGdpr")}</p>
            <div className="circle Russia"></div>
            <p>{i18n.t("common:jurisdiction.russia")}</p>
            <div className="circle Five-Eyes"></div>
            <p>{i18n.t("common:jurisdiction.fiveEyes")}</p>
            <div className="circle China"></div>
            <p>{i18n.t("common:jurisdiction.china")}</p>
            <div className="circle Others"></div>
            <p>{i18n.t("common:jurisdiction.undisclosed")}</p>
        </div>
    );

    return (
        <Screen className="data-region-info-screen" light={true}>
            <h1 className="heading">
                {i18n.t("dataRegionInfoScreen:heading")}
            </h1>
            <img
                src="./images/dataregion-info-world-map.svg"
                alt=""
                className="world-map"
            />
            {locationTooltip}
            <p className="text">{i18n.t("dataRegionInfoScreen:world")}</p>
        </Screen>
    );
};

export default DataRegionInfo;
