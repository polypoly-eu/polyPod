import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const CompaniesBarChartInfo = () => {
    const CompaniesBarChartInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("companiesBarChartInfoScreen:p1")}</p>
            {/* <Infographic
                type="verticalBarChartInfo"
                texts={{
                    text1: i18n.t("infographic:verticalBarChartInfo.text1"),
                    boldLabel: i18n.t(
                        "infographic:verticalBarChartInfo.boldLegend"
                    ),
                    textYaxis: i18n.t(
                        "infographic:verticalBarChartInfo.textYaxis"
                    ),
                    textXaxis: i18n.t(
                        "infographic:verticalBarChartInfo.textXaxis"
                    ),
                }}
            /> */}
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`commonInfoScreen:bar.chart`),
                }}
            />
        </div>,
        <p className="base-info-padding">
            {i18n.t("companiesBarChartInfoScreen:p2")}
        </p>,
    ];
    return (
        <StoriesInfoScreen
            className="companies-bar-chart-info"
            infoChildren={CompaniesBarChartInfoContent}
        />
    );
};

export default CompaniesBarChartInfo;
