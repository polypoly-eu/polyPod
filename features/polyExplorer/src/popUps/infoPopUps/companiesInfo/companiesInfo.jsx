import React from "react";

import i18n from "../../../i18n.js";
import BaseInfoPopUp from "../../../components/baseInfoPopUp/baseInfoPopUp.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const CompaniesInfo = ({ onClose }) => {
    return (
        <BaseInfoPopUp
            className="companies-info"
            headline={i18n.t("explorationCompaniesInfoScreen:headline")}
            onClose={onClose}
        >
            <div className="base-info-padding">
                <div
                    dangerouslySetInnerHTML={{
                        __html: i18n.t("explorationCompaniesInfoScreen:text.1"),
                    }}
                />
                <Infographic
                    type="companies"
                    texts={{
                        text1: i18n.t("infographic:companies.text1"),
                        text2: i18n.t("infographic:companies.text2"),
                        text3: i18n.t("infographic:companies.text3"),
                        text4: i18n.t("infographic:companies.text4"),
                        text5: i18n.t("infographic:companies.text5"),
                        text6: i18n.t("infographic:companies.text6"),
                        text7: i18n.t("infographic:companies.text7"),
                        text8: i18n.t("infographic:companies.text8"),
                    }}
                />
            </div>
        </BaseInfoPopUp>
    );
};

export default CompaniesInfo;
