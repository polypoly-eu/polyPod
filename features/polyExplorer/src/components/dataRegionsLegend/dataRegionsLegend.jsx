import React from "react";

import "./dataRegionsLegend.css";
import i18n from "../../i18n.js";
import { I18nSection } from "@polypoly-eu/silly-i18n";

const i18nC = new I18nSection( i18n, "common");

const DataRegionsLegend = () => {
    return (
        <div className="location-legend">
            <div className="legend-container">
                <p className="jurisdictions-label">
                    {i18n.t("entityDetailsScreen:jurisdictions")}:
                </p>
                <div className="legend">
                    <div>
                        <div className="circle China"></div>
                        <p>{i18nC.t("jurisdiction.china")}</p>
                    </div>
                    <div>
                        <div className="circle Five-Eyes"></div>
                        <p>{i18nC.t("jurisdiction.fiveEyes")}</p>
                    </div>
                    <div>
                        <div className="circle Russia"></div>
                        <p>{i18nC.t("jurisdiction.russia")}</p>
                    </div>
                    <div>
                        <div className="circle EU-GDPR"></div>
                        <p>{i18nC.t("jurisdiction.euGdpr")}</p>
                    </div>
                    <div>
                        <div className="circle Others"></div>
                        <p>{i18nC.t("jurisdiction.undisclosed")}</p>
                    </div>
                </div>
            </div>
            <div className="source">
                <p>{i18nC.t("source")}: polyPedia</p>
            </div>
        </div>
    );
};

export default DataRegionsLegend;
