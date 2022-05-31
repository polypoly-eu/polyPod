import React from "react";
import { Infographic } from "@polypoly-eu/poly-look";
import i18n from "!silly-i18n";
import svg from "../../static/images/infographic/packedCircleChart.svg";
const DataStructure = () => {
    return (
        <>
            <p>{i18n.t("dataStructureInfoScreen:text1")}</p>
            <Infographic
                image={{
                    svg: svg,
                    texts: {
                        text1: i18n.t(
                            "commonInfoScreen:infographic.value.category"
                        ),
                    },
                }}
                explanation={[
                    i18n.t("dataStructureInfoScreen:explanation-item1"),
                    i18n.t("dataStructureInfoScreen:explanation-item2"),
                    i18n.t("dataStructureInfoScreen:explanation-item3"),
                ]}
                legend={[
                    {
                        type: "circle",
                        items: [
                            {
                                color: "#3749A9",
                                description: i18n.t(
                                    "commonInfoScreen:infographic.legend"
                                ),
                            },
                        ],
                        tooltip: {
                            label: "1",
                            pointerDirection: "down",
                        },
                    },
                ]}
            />

            <p
                dangerouslySetInnerHTML={{
                    __html: i18n.t("commonInfoScreen:bubble.chart"),
                }}
            />
            <div className="poly-separator separator-space"></div>
            <h1 className="about-title">
                {i18n.t("commonInfoScreen:baseInfo.title2")}
            </h1>
            <p>{i18n.t("dataStructureInfoScreen:text2")}</p>
        </>
    );
};

export default DataStructure;
