import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const LineChartInfo = () => {
    const lineChartInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("lineChartInfoScreen:p1")}</p>
            <Infographic
                type="lineChartInfo"
                texts={{
                    textLegend1: i18n.t(
                        "infographic:lineChartInfo.textLegend1"
                    ),
                    textLegend2: i18n.t(
                        "infographic:lineChartInfo.textLegend2"
                    ),
                    textLabel1: i18n.t("infographic:lineChartInfo.textLabel1"),
                    textLabel2: i18n.t("infographic:lineChartInfo.textLabel2"),
                    textXaxis: i18n.t("infographic:lineChartInfo.textXaxis"),
                    boldYaxis: i18n.t("infographic:lineChartInfo.boldYaxis"),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`lineChartInfoScreen:p2`),
                }}
            />
            <p>{i18n.t("lineChartInfoScreen:p3")}</p>
        </div>,
        <p
            className="base-info-padding"
            dangerouslySetInnerHTML={{
                __html: i18n.t(`lineChartInfoScreen:p4`),
            }}
        />,
    ];
    return (
        <StoriesInfoScreen
            className="line-chart-info"
            infoChildren={lineChartInfoContent}
        />
    );
};

export default LineChartInfo;
