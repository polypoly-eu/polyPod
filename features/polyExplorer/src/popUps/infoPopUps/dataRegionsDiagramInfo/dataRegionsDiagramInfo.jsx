import React from "react";

import i18n from "!silly-i18n";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";
import { DataRegionInfoContent } from "../dataRegionInfo/dataRegionInfo.jsx";

const DataRegionsDiagramInfo = () => {
    const dataRegionsDiagramInfoContent = [
        <>
            <div className="base-info-padding">
                <p>{i18n.t("dataRegionsDiagramInfoScreen:p1")}</p>
                <Infographic
                    type="flowDiagramInfo"
                    texts={{
                        textYear1: i18n.t(
                            "infographic:flowDiagramInfo.textYear1"
                        ),
                        textYear2: i18n.t(
                            "infographic:flowDiagramInfo.textYear2"
                        ),
                    }}
                />
                <p
                    dangerouslySetInnerHTML={{
                        __html: i18n.t(`commonInfoScreen:alluvial.diagram1`),
                    }}
                />
                <p>{i18n.t("commonInfoScreen:alluvial.diagram2")}</p>
            </div>
            <div className="data-region-info-screen">
                <DataRegionInfoContent />
            </div>
        </>,
    ];
    return (
        <div>
            <StoriesInfoScreen
                className="data-regions-diagram-info"
                infoChildren={dataRegionsDiagramInfoContent}
            ></StoriesInfoScreen>
        </div>
    );
};

export default DataRegionsDiagramInfo;
