import React from "react";

import i18n from "../../i18n.js";
import ExplorationInfoScreen from "../../components/explorationInfoScreen/explorationInfoScreen.jsx";

import "./dataRegionInfo.css";

const DataRegionInfo = ({ onClose }) => {
    return (
        <ExplorationInfoScreen className="data-region-info-screen" light={true}>
            <h1 className="heading">
                {i18n.t("dataRegionInfoScreen:heading")}
            </h1>
            <img src="./images/maps/jurisdictions/world.svg" alt="" />
            <div className="legend-container">
                <div className="jurisdictions-label">
                    <p>{i18n.t("companyDetailsScreen:jurisdictions")}:</p>
                </div>
                <div className="legend">
                    <div>
                        <div className="circle China"></div>
                        <p>{i18n.t("common:jurisdiction.china")}</p>
                    </div>
                    <div>
                        <div className="circle Five-Eyes"></div>
                        <p>{i18n.t("common:jurisdiction.fiveEyes")}</p>
                    </div>
                    <div>
                        <div className="circle Russia"></div>
                        <p>{i18n.t("common:jurisdiction.russia")}</p>
                    </div>
                    <div>
                        <div className="circle EU-GDPR"></div>
                        <p>{i18n.t("common:jurisdiction.euGdpr")}</p>
                    </div>
                    <div>
                        <div className="circle Others"></div>
                        <p>{i18n.t("common:jurisdiction.undisclosed")}</p>
                    </div>
                </div>
            </div>
            <p>{i18n.t("dataRegionInfoScreen:world")}</p>
            <h2 className="sub-heading">
                {i18n.t("common:jurisdiction.euGdpr")}
            </h2>
            <img src="./images/maps/jurisdictions/eu-gdpr.svg" alt="" />
            <div className="legend-container">
                <div className="jurisdictions-label">
                    <p>{i18n.t("companyDetailsScreen:jurisdictions")}:</p>
                </div>
                <div className="legend">
                    <div>
                        <div className="circle EU-GDPR"></div>
                        <p>{i18n.t("common:jurisdiction.euGdpr")}</p>
                    </div>
                </div>
            </div>
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("dataRegionInfoScreen:euGdpr.text"),
                }}
            ></div>
            <h2 className="sub-heading">
                {i18n.t("dataRegionInfoScreen:subHeading.fiveEyes")}
            </h2>
            <img
                src="./images/maps/jurisdictions/five-eyes.svg"
                alt=""
                className="world-map"
            />
            <div className="legend-container">
                <div className="jurisdictions-label">
                    <p>{i18n.t("companyDetailsScreen:jurisdictions")}:</p>
                </div>
                <div className="legend">
                    <div>
                        <div className="circle Five-Eyes"></div>
                        <p>{i18n.t("common:jurisdiction.fiveEyes")}</p>
                    </div>
                </div>
            </div>
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
            <img src="./images/maps/jurisdictions/russia.svg" alt="" />
            <div className="legend-container">
                <div className="jurisdictions-label">
                    <p>{i18n.t("companyDetailsScreen:jurisdictions")}:</p>
                </div>
                <div className="legend">
                    <div>
                        <div className="circle Russia"></div>
                        <p>{i18n.t("common:jurisdiction.russia")}</p>
                    </div>
                </div>
            </div>
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("dataRegionInfoScreen:russia.text"),
                }}
            ></div>
            <h2 className="sub-heading">
                {i18n.t("common:jurisdiction.china")}
            </h2>
            <img src="./images/maps/jurisdictions/china.svg" alt="" />
            <div className="legend-container">
                <div className="jurisdictions-label">
                    <p>{i18n.t("companyDetailsScreen:jurisdictions")}:</p>
                </div>
                <div className="legend">
                    <div>
                        <div className="circle China"></div>
                        <p>{i18n.t("common:jurisdiction.china")}</p>
                    </div>
                </div>
            </div>
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("dataRegionInfoScreen:china.text"),
                }}
            ></div>
            <h2 className="sub-heading">
                {i18n.t("common:jurisdiction.undisclosed")}
            </h2>
            <img src="./images/maps/jurisdictions/others.svg" alt="" />
            <div className="legend-container">
                <div className="jurisdictions-label">
                    <p>{i18n.t("companyDetailsScreen:jurisdictions")}:</p>
                </div>
                <div className="legend">
                    <div>
                        <div className="circle Others"></div>
                        <p>{i18n.t("common:jurisdiction.undisclosed")}</p>
                    </div>
                </div>
            </div>
            <div
                dangerouslySetInnerHTML={{
                    __html: i18n.t("dataRegionInfoScreen:undisclosed.text"),
                }}
            ></div>
            <button onClick={onClose}>
                {i18n.t("infoScreen:button.explore")}
            </button>
        </ExplorationInfoScreen>
    );
};

export default DataRegionInfo;
