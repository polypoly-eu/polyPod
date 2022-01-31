import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const PurposesBarChartInfo = () => {
    const purposesBarChartInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("purposesBarChartInfoScreen:p1")}</p>
            <Infographic
                type="purposesBarChart"
                texts={{
                    textMaximum: i18n.t(
                        "infographic:purposesBarChartInfo.textMaximum"
                    ),
                    textAverage: i18n.t(
                        "infographic:purposesBarChartInfo.textAverage"
                    ),
                    textAverageValue: i18n.t(
                        "infographic:purposesBarChartInfo.textAverageValue"
                    ),
                    textHighestValue: i18n.t(
                        "infographic:purposesBarChartInfo.textHighestValue"
                    ),
                    textMaxValue: i18n.t(
                        "infographic:purposesBarChartInfo.textMaxValue"
                    ),
                    textNameOfPurpose: i18n.t(
                        "infographic:purposesBarChartInfo.textNameOfPurpose"
                    ),
                    boldNumber: i18n.t(
                        "infographic:purposesBarChartInfo.boldNumber"
                    ),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`commonInfoScreen:bar.chart`),
                }}
            />
        </div>,
        <div className="base-info-padding">
            <p>{i18n.t("purposesBarChartInfoScreen:p2")}</p>
        </div>,
    ];
    return (
        <StoriesInfoScreen
            className="purposes-bar-chart-info"
            infoChildren={purposesBarChartInfoContent}
        />
    );
};

export default PurposesBarChartInfo;
