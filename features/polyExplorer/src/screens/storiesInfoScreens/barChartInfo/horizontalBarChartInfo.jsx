import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const HorizontalBarChartInfo = () => {
    const horizontalBarChartInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("commonInfoScreen:bar.chart.p1")}</p>
            <Infographic
                type="horizontalBarChartInfo"
                texts={{
                    textValue: i18n.t(
                        "infographic:horizontalBarChartInfo.textValue"
                    ),
                    textLabel: i18n.t(
                        "infographic:horizontalBarChartInfo.textLabel"
                    ),
                    textVariableA: i18n.t(
                        "infographic:horizontalBarChartInfo.textVariableA"
                    ),
                    textVariableB: i18n.t(
                        "infographic:horizontalBarChartInfo.textVariableB"
                    ),
                    textVariableC: i18n.t(
                        "infographic:horizontalBarChartInfo.textVariableC"
                    ),
                    textVariableD: i18n.t(
                        "infographic:horizontalBarChartInfo.textVariableD"
                    ),
                    textVariableE: i18n.t(
                        "infographic:horizontalBarChartInfo.textVariableE"
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
            <p>{i18n.t("commonInfoScreen:bar.chart.p3")}</p>
            <p>{i18n.t("commonInfoScreen:bar.chart.p4")}</p>
        </div>,
    ];
    return (
        <StoriesInfoScreen
            className="horizontal-bar-chart-info"
            infoChildren={horizontalBarChartInfoContent}
        />
    );
};

export default HorizontalBarChartInfo;
