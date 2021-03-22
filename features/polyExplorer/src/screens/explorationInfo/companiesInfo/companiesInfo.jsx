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
            <p>{i18n.t("explorationCompaniesInfoScreen:text.2")}</p>
        </ExplorationInfoScreen>
    );
};

export default CompaniesInfo;
