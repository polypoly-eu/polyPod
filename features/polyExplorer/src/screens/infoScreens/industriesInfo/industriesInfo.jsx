import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const IndustriesInfo = () => {
    const companyDataTypesInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("industriesInfoScreen:p1")}</p>
            <Infographic
                type="packedCircleInfo"
                texts={{
                    textLabel1: i18n.t(
                        "infographic:packedCircleInfo.textLabel1"
                    ),
                    textLabel2: i18n.t(
                        "infographic:packedCircleInfo.textLabel2"
                    ),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`commonInfoScreen:circle.packing`),
                }}
            />
        </div>,
        <p className="base-info-padding">
            {i18n.t("industriesInfoScreen:p2")}
        </p>,
    ];
    return (
        <StoriesInfoScreen
            className="company-data-types-info"
            infoChildren={companyDataTypesInfoContent}
        />
    );
};

export default IndustriesInfo;
