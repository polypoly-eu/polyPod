import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const MessengerTreemapInfo = () => {
    const messengerTreemapInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("messengerTreemapInfoScreen:p1")}</p>
            <p>{i18n.t("messengerTreemapInfoScreen:p2")}</p>
            <p>{i18n.t("messengerTreemapInfoScreen:p3")}</p>
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
                    __html: i18n.t(`commonInfoScreen:treemap`),
                }}
            />
        </div>,
        <p className="base-info-padding">
            {i18n.t("messengerTreemapInfoScreen:p4")}
        </p>,
    ];
    return (
        <StoriesInfoScreen
            className="messenger-treemap-info"
            infoChildren={messengerTreemapInfoContent}
        />
    );
};

export default MessengerTreemapInfo;
