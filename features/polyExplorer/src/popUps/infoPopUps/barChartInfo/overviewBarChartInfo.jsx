import React from "react";

import i18n from "../../../i18n.js";
import StoriesInfoScreen from "../../../components/clusterStories/storiesInfoScreen.jsx";
import Infographic from "../../../components/infographic/infographic.jsx";

const OverviewBarChartInfo = () => {
    const overviewBarChartInfoContent = [
        <div className="base-info-padding">
            <p>{i18n.t("overviewBarChartInfoScreen:p1")}</p>
            <p>{i18n.t("overviewBarChartInfoScreen:p2")}</p>
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
            <p>{i18n.t("overviewBarChartInfoScreen:p3")}</p>
            <p>{i18n.t("overviewBarChartInfoScreen:p4")}</p>
        </div>,
    ];
    return (
        <StoriesInfoScreen
            className="overview-bar-chart-info"
            infoChildren={overviewBarChartInfoContent}
        />
    );
};

export default OverviewBarChartInfo;
