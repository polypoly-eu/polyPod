import React from "react";

import "./dataRegionsLegend.css";
import i18n from "../../i18n.js";

const DataRegionsLegend = () => {
    return (
        <div className="location-legend">
            <div className="legend">
                <p className="jurisdictions-label">
                    {i18n.t("entityDetailsScreen:jurisdictions")}:
                </p>
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
            <div className="source">
                <p>{i18n.t("common:source")}: polyPedia</p>
            </div>
        </div>
    );
};

export default DataRegionsLegend;
