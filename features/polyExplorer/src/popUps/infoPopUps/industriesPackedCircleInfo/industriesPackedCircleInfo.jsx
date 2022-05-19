import React from "react";

import i18n from "!silly-i18n";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const IndustriesPackedCircleInfo = () => {
    const industriesPackedCircleInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("industriesPackedCircleInfoScreen:p1")}</p>
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
            {i18n.t("industriesPackedCircleInfoScreen:p2")}
        </p>,
    ];
    return (
        <StoriesInfoScreen
            className="industries-packed-circle-info"
            infoChildren={industriesPackedCircleInfoContent}
        />
    );
};

export default IndustriesPackedCircleInfo;
