import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const DetailsLineChartInfo = () => {
    const detailsLineChartInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("detailsLineChartInfoScreen:p1")}</p>
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
                    __html: i18n.t(`commonInfoScreen:line.chart1`),
                }}
            />
            <p>{i18n.t("commonInfoScreen:line.chart2")}</p>
        </div>,
        <p
            className="base-info-padding"
            dangerouslySetInnerHTML={{
                __html: i18n.t(`detailsLineChartInfoScreen:p2`),
            }}
        />,
    ];
    return (
        <StoriesInfoScreen
            className="details-line-chart-info"
            infoChildren={detailsLineChartInfoContent}
        />
    );
};

export default DetailsLineChartInfo;
