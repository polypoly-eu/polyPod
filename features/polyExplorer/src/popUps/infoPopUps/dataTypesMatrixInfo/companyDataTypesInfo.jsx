import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const CompanyDataTypesInfo = () => {
    const companyDataTypesInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("dataTypesInfoScreens:company.p1")}</p>
            <Infographic
                type="companyDataTypes"
                texts={{
                    text: i18n.t("infographic:companyDataTypes.text"),
                    boldLabel1: i18n.t(
                        "infographic:companyDataTypes.boldLabel1"
                    ),
                    boldLabel2: i18n.t(
                        "infographic:companyDataTypes.boldLabel2"
                    ),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`commonInfoScreen:bubble.chart`),
                }}
            />
        </div>,
        <p className="base-info-padding">
            {i18n.t("dataTypesInfoScreens:p2")}
        </p>,
    ];
    return (
        <StoriesInfoScreen
            className="company-data-types-info"
            infoChildren={companyDataTypesInfoContent}
        />
    );
};

export default CompanyDataTypesInfo;
