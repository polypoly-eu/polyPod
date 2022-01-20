import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";
import DataRegionInfoScreen from "../../../screens/dataRegionInfo/dataRegionInfo.jsx";

const FlowDiagramInfo = () => {
    const flowDiagramInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("flowDiagramInfoScreen:p1")}</p>
            <Infographic
                type="flowDiagramInfo"
                texts={{
                    textYear1: i18n.t("infographic:flowDiagramInfo.textYear1"),
                    textYear2: i18n.t("infographic:flowDiagramInfo.textYear2"),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`flowDiagramInfoScreen:p2`),
                }}
            />
            <p>{i18n.t("flowDiagramInfoScreen:p3")}</p>
        </div>,
    ];
    return (
        <div>
            <StoriesInfoScreen
                className="flow-diagram-info"
                infoChildren={flowDiagramInfoContent}
                noButton
            ></StoriesInfoScreen>
            <DataRegionInfoScreen />
        </div>
    );
};

export default FlowDiagramInfo;
