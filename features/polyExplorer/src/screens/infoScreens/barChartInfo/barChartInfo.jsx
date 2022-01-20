import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const BarChartInfo = () => {
    const barChartInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("barChartInfoScreen:p1")}</p>
            <Infographic
                type="barChartInfo"
                texts={{
                    textMaximum: i18n.t("infographic:barChartInfo.textMaximum"),
                    textAverage: i18n.t("infographic:barChartInfo.textAverage"),
                    textAverageValue: i18n.t(
                        "infographic:barChartInfo.textAverageValue"
                    ),
                    textHighestValue: i18n.t(
                        "infographic:barChartInfo.textHighestValue"
                    ),
                    textMaxValue: i18n.t(
                        "infographic:barChartInfo.textMaxValue"
                    ),
                    textNameOfPurpose: i18n.t(
                        "infographic:barChartInfo.textNameOfPurpose"
                    ),
                    boldNumber: i18n.t("infographic:barChartInfo.boldNumber"),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`barChartInfoScreen:p2`),
                }}
            />
        </div>,
        <div className="base-info-padding">
            <p>{i18n.t("barChartInfoScreen:p3")}</p>
            <p>{i18n.t("barChartInfoScreen:p4")}</p>
        </div>,
    ];
    return (
        <StoriesInfoScreen
            className="bar-chart-info"
            infoChildren={barChartInfoContent}
        />
    );
};

export default BarChartInfo;
