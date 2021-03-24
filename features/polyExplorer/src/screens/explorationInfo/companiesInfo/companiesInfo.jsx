import React from "react";

import i18n from "../../../i18n.js";
import ExplorationInfoScreen from "../../../components/explorationInfoScreen/explorationInfoScreen.jsx";

const CompaniesInfo = ({ onClose }) => {
    return (
        <ExplorationInfoScreen
            className="companies-info"
            headline={i18n.t("explorationCompaniesInfoScreen:headline")}
            onClose={onClose}
        >
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
        </ExplorationInfoScreen>
    );
};

export default CompaniesInfo;
