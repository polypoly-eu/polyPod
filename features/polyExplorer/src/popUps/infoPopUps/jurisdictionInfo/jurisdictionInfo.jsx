import React from "react";

import i18n from "../../../i18n.js";
import "./jurisdictionInfo.css";
import BaseInfoScreen from "../../../components/baseInfoScreen/baseInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const JurisdictionInfo = ({ onClose }) => {
    return (
        <BaseInfoScreen
            className="jurisdiction-info"
            headline={i18n.t("explorationJurisdictionInfoScreen:headline")}
            onClose={onClose}
        >
            <div className="base-info-padding">
                <p>{i18n.t("explorationJurisdictionInfoScreen:text.1")}</p>
                <h2>
                    {i18n.t("explorationJurisdictionInfoScreen:subheading.1")}
                </h2>
                <p>{i18n.t("explorationJurisdictionInfoScreen:text.2")}</p>
                <div className="tree-legend">
                    <p>
                        {i18n.t("explorationJurisdictionInfoScreen:legend.1")}
                    </p>
                    <p>
                        {i18n.t("explorationJurisdictionInfoScreen:legend.2")}
                    </p>
                </div>
                <Infographic
                    type="jurisdiction"
                    texts={{
                        "jurisdiction-blue1": i18n.t(
                            "common:jurisdiction.euGdpr"
                        ),
                        "jurisdiction-blue2": i18n.t(
                            "common:jurisdiction.undisclosed"
                        ),
                        "jurisdiction-white1": i18n.t(
                            "common:jurisdiction.fiveEyes"
                        ),
                        "jurisdiction-white2": i18n.t(
                            "common:jurisdiction.china"
                        ),
                        "jurisdiction-white3": i18n.t(
                            "common:jurisdiction.russia"
                        ),
                    }}
                />
                <br />
                <div className="tree-legend">
                    <p>
                        {i18n.t("explorationJurisdictionInfoScreen:legend.3")}
                    </p>
                    <p>
                        {i18n.t("explorationJurisdictionInfoScreen:legend.4")}
                    </p>
                </div>
            </div>
            <Infographic type="jurisdiction2" texts={{}} />
            <div className="base-info-padding">
                <div className="legend-container">
                    <div className="jurisdictions-label">
                        <p>{i18n.t("entityDetailsScreen:jurisdictions")}:</p>
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
                <h2>
                    {i18n.t("explorationJurisdictionInfoScreen:subheading.2")}
                </h2>
                <p>{i18n.t("explorationJurisdictionInfoScreen:text.3")}</p>
                <div className="separator"></div>
                <br />
                <h2 className="sub-heading">
                    {i18n.t("common:jurisdiction.euGdpr")}
                </h2>
            </div>
            <img
                src="./images/maps/jurisdictions/eu-gdpr.svg"
                className="map"
            />
            <div className="base-info-padding">
                <div className="legend-container">
                    <div className="jurisdictions-label">
                        <p>{i18n.t("entityDetailsScreen:jurisdictions")}:</p>
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
            </div>
            <img
                src="./images/maps/jurisdictions/five-eyes.svg"
                alt=""
                className="map"
            />
            <div className="base-info-padding">
                <div className="legend-container">
                    <div className="jurisdictions-label">
                        <p>{i18n.t("entityDetailsScreen:jurisdictions")}:</p>
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
            </div>
            <img src="./images/maps/jurisdictions/russia.svg" className="map" />
            <div className="base-info-padding">
                <div className="legend-container">
                    <div className="jurisdictions-label">
                        <p>{i18n.t("entityDetailsScreen:jurisdictions")}:</p>
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
            </div>
            <img src="./images/maps/jurisdictions/china.svg" className="map" />
            <div className="base-info-padding">
                <div className="legend-container">
                    <div className="jurisdictions-label">
                        <p>{i18n.t("entityDetailsScreen:jurisdictions")}:</p>
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
            </div>
            <img src="./images/maps/jurisdictions/others.svg" className="map" />
            <div className="base-info-padding">
                <div className="legend-container">
                    <div className="jurisdictions-label">
                        <p>{i18n.t("entityDetailsScreen:jurisdictions")}:</p>
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
            </div>
        </BaseInfoScreen>
    );
};

export default JurisdictionInfo;
