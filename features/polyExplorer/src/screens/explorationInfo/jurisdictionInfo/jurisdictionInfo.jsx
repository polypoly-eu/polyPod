import React from "react";

import i18n from "../../../i18n.js";
import "../jurisdictionInfo/jurisdictionInfo.css";
import InfoScreen from "../../../components/infoScreen/infoScreen.jsx";

const JurisdictionInfo = ({ onClose }) => {
    return (
        <InfoScreen
            className="jurisdiction-info"
            headline={i18n.t("explorationJurisdictionInfoScreen:headline")}
            onClose={onClose}
        >
            <p>{i18n.t("explorationJurisdictionInfoScreen:text.1")}</p>
            <h2>{i18n.t("explorationJurisdictionInfoScreen:subheading.1")}</h2>
            <p>{i18n.t("explorationJurisdictionInfoScreen:text.2")}</p>
            <div className="tree-legend">
                <p>{i18n.t("explorationJurisdictionInfoScreen:legend.1")}</p>
                <p>{i18n.t("explorationJurisdictionInfoScreen:legend.2")}</p>
            </div>
            <img
                src={`./images/infographics/jurisdictions/1_${i18n.t(
                    "common:country.code"
                )}.svg`}
            />
            <br />
            <div className="tree-legend">
                <p>{i18n.t("explorationJurisdictionInfoScreen:legend.3")}</p>
                <p>{i18n.t("explorationJurisdictionInfoScreen:legend.4")}</p>
            </div>
            <img
                src={`./images/infographics/jurisdictions/2_${i18n.t(
                    "common:country.code"
                )}.svg`}
            />
            <div className="legend-container">
                <div className="jurisdictions-label">
                    <p>{i18n.t("companyDetailsScreen:jurisdictions")}:</p>
                </div>
                <div className="legend fixed-graphic">
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
            <br />
            <h2>{i18n.t("explorationJurisdictionInfoScreen:subheading.2")}</h2>
            <p>{i18n.t("explorationJurisdictionInfoScreen:text.3")}</p>
            <div className="separator"></div>
            <br />
            <h2 className="sub-heading">
                {i18n.t("common:jurisdiction.euGdpr")}
            </h2>
            <img
                src="./images/maps/jurisdictions/eu-gdpr.svg"
                className="map"
            />
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
                className="map"
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
            <img src="./images/maps/jurisdictions/russia.svg" className="map" />
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
            <img src="./images/maps/jurisdictions/china.svg" className="map" />
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
            <img src="./images/maps/jurisdictions/others.svg" className="map" />
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
        </InfoScreen>
    );
};

export default JurisdictionInfo;
