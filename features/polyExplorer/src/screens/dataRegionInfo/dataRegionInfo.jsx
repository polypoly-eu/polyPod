import React from "react";

import i18n from "../../i18n.js";
import Screen from "../../components/screen/screen.jsx";

import "./dataRegionInfo.css";

const DataRegionInfo = ({ onClose }) => {
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
            <p>{i18n.t("dataRegionInfoScreen:world")}</p>
            <h2 className="sub-heading">
                {i18n.t("common:jurisdiction.euGdpr")}
            </h2>
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("dataRegionInfoScreen:euGdpr.text"),
                }}
            ></div>
            <h2 className="sub-heading">
                {i18n.t("dataRegionInfoScreen:subHeading.fiveEyes")}
            </h2>
            <h2 className="sub-sub-heading">USA</h2>
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("dataRegionInfoScreen:USA.text"),
                }}
            ></div>
            <h2 className="sub-sub-heading">
                {i18n.t("common:jurisdiction.fiveEyes")}
            </h2>
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("dataRegionInfoScreen:fiveEyes.text"),
                }}
            ></div>
            <h2 className="sub-heading">
                {i18n.t("common:jurisdiction.russia")}
            </h2>
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("dataRegionInfoScreen:russia.text"),
                }}
            ></div>
            <h2 className="sub-heading">
                {i18n.t("common:jurisdiction.china")}
            </h2>
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("dataRegionInfoScreen:china.text"),
                }}
            ></div>
            <h2 className="sub-heading">
                {i18n.t("common:jurisdiction.undisclosed")}
            </h2>
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("dataRegionInfoScreen:undisclosed.text"),
                }}
            ></div>
            <button onClick={onClose}>
                {i18n.t("infoScreen:button.explore")}
            </button>
        </Screen>
    );
};

export default DataRegionInfo;
