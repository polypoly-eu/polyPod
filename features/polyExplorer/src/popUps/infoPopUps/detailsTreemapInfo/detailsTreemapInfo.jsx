import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const DetailsTreemapInfo = () => {
    const detailsTreemapInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("detailsTreemapInfoScreen:p1")}</p>
            <p>{i18n.t("detailsTreemapInfoScreen:p2")}</p>
            <p>{i18n.t("detailsTreemapInfoScreen:p3")}</p>
            <Infographic
                type="treemapInfo"
                texts={{
                    textLabel1: i18n.t("infographic:treemapInfo.textLabel1"),
                    textLabel2: i18n.t("infographic:treemapInfo.textLabel2"),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`commonInfoScreen:treemap`),
                }}
            />
        </div>,
        <p className="base-info-padding">
            {i18n.t("detailsTreemapInfoScreen:p4")}
        </p>,
    ];
    return (
        <StoriesInfoScreen
            className="details-treemap-info"
            infoChildren={detailsTreemapInfoContent}
        />
    );
};

export default DetailsTreemapInfo;
