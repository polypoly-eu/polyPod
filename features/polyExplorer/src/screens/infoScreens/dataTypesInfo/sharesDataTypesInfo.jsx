import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const SharesDataTypesInfo = () => {
    const sharesDataTypesInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("dataTypesInfoScreens:shares.p1")}</p>
            <Infographic
                type="sharesDataTypes"
                texts={{
                    text: i18n.t("infographic:sharesDataTypes.text"),
                    boldLabel1: i18n.t(
                        "infographic:sharesDataTypes.boldLabel1"
                    ),
                    boldLabel2: i18n.t(
                        "infographic:sharesDataTypes.boldLabel2"
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
            {i18n.t("dataTypesInfoScreens:p2")}
        </p>,
    ];
    return (
        <StoriesInfoScreen
            className="shares-data-types-info"
            infoChildren={sharesDataTypesInfoContent}
        />
    );
};

export default SharesDataTypesInfo;
