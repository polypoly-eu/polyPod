import React from "react";

import i18n from "../../i18n.js";
import StoriesInfoScreen from "../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../components/infographic/infographic.jsx";

const CompanyRevenueBarChartInfo = () => {
    const CompanyRevenueBarChartInfoContent = [
        <div className="base-info-padding">
            <Infographic
                type="verticalBarChartInfo"
                texts={{
                    text1: i18n.t("infographic:verticalBarChartInfo.text1"),
                    boldLegend: i18n.t(
                        "infographic:verticalBarChartInfo.boldLegend"
                    ),
                    textYaxis: i18n.t(
                        "infographic:verticalBarChartInfo.textYaxis"
                    ),
                    textXaxis: i18n.t(
                        "infographic:verticalBarChartInfo.textXaxis"
                    ),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`commonInfoScreen:bar.chart`),
                }}
            />
        </div>,
    ];
    return (
        <StoriesInfoScreen
            className="companies-bar-chart-info"
            infoChildren={CompanyRevenueBarChartInfoContent}
        />
    );
};

export default CompanyRevenueBarChartInfo;
