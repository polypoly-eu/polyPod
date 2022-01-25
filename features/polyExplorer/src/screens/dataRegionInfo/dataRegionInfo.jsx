import React from "react";

import i18n from "../../i18n.js";
import BaseInfoScreen from "../../components/baseInfoScreen/baseInfoScreen.jsx";
import SectionTitle from "../../components/clusterStories/sectionTitle.jsx";

import "./dataRegionInfo.css";

const DataRegionInfo = ({ onClose }) => {
    return (
        <BaseInfoScreen className="data-region-info-screen" onClose={onClose}>
            <div className="base-info-padding">
                <SectionTitle
                    title={i18n.t("dataRegionInfoScreen:heading")}
                    infoScreenSize={true}
                />
            </div>
            <img src="./images/maps/jurisdictions/world.svg" className="map" />
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
                <SectionTitle
                    title={i18n.t("common:jurisdiction.euGdpr")}
                    infoScreenSize={true}
                />
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
                <SectionTitle
                    title={i18n.t("dataRegionInfoScreen:subHeading.fiveEyes")}
                    infoScreenSize={true}
                />
            </div>
            <img
                src="./images/maps/jurisdictions/five-eyes.svg"
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
                <SectionTitle title="USA" infoScreenSize={true} />

                <div
                    dangerouslySetInnerHTML={{
                        __html: i18n.t("dataRegionInfoScreen:USA.text"),
                    }}
                ></div>
                <SectionTitle
                    title={i18n.t("common:jurisdiction.fiveEyes")}
                    infoScreenSize={true}
                />

                <div
                    dangerouslySetInnerHTML={{
                        __html: i18n.t("dataRegionInfoScreen:fiveEyes.text"),
                    }}
                ></div>
                <SectionTitle
                    title={i18n.t("common:jurisdiction.russia")}
                    infoScreenSize={true}
                />
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
                <SectionTitle
                    title={i18n.t("common:jurisdiction.china")}
                    infoScreenSize={true}
                />
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
                <SectionTitle
                    title={i18n.t("common:jurisdiction.undisclosed")}
                    infoScreenSize={true}
                />
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

export default DataRegionInfo;
