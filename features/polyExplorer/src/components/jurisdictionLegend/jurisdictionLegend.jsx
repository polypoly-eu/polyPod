import React from "react";

import "./jurisdictionLegend.css";
import i18n from "../../i18n.js";

const JurisdictionLegend = ({ onOpenRegionInfo = false }) => {
    return (
        <div className="location-legend">
            <div className="source">
                <p>{i18n.t("common:source")}:</p>
                <p>polyPedia</p>
            </div>
            <div className="data-regions">
                <p className="jurisdictions-label">
                    {i18n.t("companyDetailsScreen:jurisdictions")}:
                </p>
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
                {onOpenRegionInfo ? (
                    <img
                        src="./images/question-circle.svg"
                        onClick={onOpenRegionInfo}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default JurisdictionLegend;
