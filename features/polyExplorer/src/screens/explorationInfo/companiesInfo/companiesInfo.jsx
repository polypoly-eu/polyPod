import React from "react";

import i18n from "../../../i18n.js";
import InfoScreen from "../../../components/infoScreen/infoScreen.jsx";

const CompaniesInfo = ({ onClose }) => {
    return (
        <InfoScreen
            className="companies-info"
            headline={i18n.t("explorationCompaniesInfoScreen:headline")}
            onClose={onClose}
        >
            <div className="info-padding">
                <div
                    dangerouslySetInnerHTML={{
                        __html: i18n.t("explorationCompaniesInfoScreen:text.1"),
                    }}
                />
                <img
                    src={`./images/infographics/companies/${i18n.t(
                        "common:country.code"
                    )}.svg`}
                />
            </div>
        </InfoScreen>
    );
};

export default CompaniesInfo;
