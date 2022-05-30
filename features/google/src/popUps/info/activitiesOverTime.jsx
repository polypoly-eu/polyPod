import React from "react";
import { Infographic } from "@polypoly-eu/poly-look";
import i18n from "!silly-i18n";
import svg from "../../static/images/infographic/barChart.svg";
const ActivitiesOverTime = () => {
    return (
        <>
            <p>{i18n.t("activitiesOverTimeInfoScreen:text1")}</p>
            <Infographic
                image={{
                    svg: svg,
                    texts: {
                        text1: i18n.t("commonInfoScreen:infographic.y.axis"),
                        text2: i18n.t("commonInfoScreen:infographic.x.axis"),
                    },
                }}
                legend={[
                    {
                        type: "block",
                        items: [
                            { color: "#3749A9", description: "Legend A" },
                            {
                                color: "#3BA6FF",
                                description: "Legend B",
                            },
                        ],
                        tooltip: {
                            label: "1",
                            pointerDirection: "down",
                        },
                    },
                ]}
                explanation={[
                    i18n.t("activitiesOverTimeInfoScreen:legend-item1"),
                    i18n.t("activitiesOverTimeInfoScreen:legend-item2"),
                    i18n.t("activitiesOverTimeInfoScreen:legend-item3"),
                ]}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t("commonInfoScreen:bar.chart"),
                }}
            />
            <div className="poly-separator separator-space"></div>
            <h1 className="about-title">
                {i18n.t("commonInfoScreen:baseInfo.title2")}
            </h1>
            <p>{i18n.t("activitiesOverTimeInfoScreen:text2")}</p>
        </>
    );
};

export default ActivitiesOverTime;
