import React, { useState, useContext } from "react";

import { ExplorerContext } from "../../context/explorer-context.jsx";
import SectionTitle from "./sectionTitle.jsx";
import MatrixBubblesChart from "./MatrixBubblesChart.jsx";
import SourceInfoButton from "../sourceInfoButton/sourceInfoButton.jsx";
import { Tabs, Tab, PolyChart } from "@polypoly-eu/poly-look";
import {
    createDataTypesTabs,
    createDataTypesSharedCombined,
} from "../../screens/stories/story-utils.js";
import i18n from "../../i18n.js";

export default function DataTypes({ entities, i18nHeader }) {
    const { globalData } = useContext(ExplorerContext);
    const bubbleColor = "#FB8A89";
    const bubbleStroke = "none";
    const bubbleTextColor = "#0f1938";

    const listOfDataCategories = Object.keys(
        globalData.personal_data_categories
    );

    const dataTypesSharedCombined = createDataTypesSharedCombined(
        entities,
        listOfDataCategories
    );

    const dataTypes = createDataTypesTabs(
        entities,
        i18nHeader,
        listOfDataCategories,
        dataTypesSharedCombined
    );

    const [selectedDataTypeBubble, setSelectedDataTypeBubble] = useState(
        dataTypesSharedCombined[0]["dpv:Category"]
    );

    const handleBubbleClick = (_, node) => {
        setSelectedDataTypeBubble(node.data.type);
    };

    const showLabel = (bubble) => {
        if (selectedDataTypeBubble === bubble.data.type) {
            return bubble.data.type
                .replace("dpv:", "")
                .replace(/([a-z])([A-Z])/, "$1 $2");
        }
    };

    return (
        <>
            <SectionTitle
                title={i18n.t("clusterStoryCommon:section.dataTypes")}
            />
            <div
                className="big-first-letter"
                dangerouslySetInnerHTML={{
                    __html: i18n.t(`${i18nHeader}:data.types.p`),
                }}
            />
            <Tabs>
                {dataTypes.map((dataType, i) => {
                    return (
                        <Tab id={dataType.id} label={dataType.label} key={i}>
                            <div className="data-types-legend">
                                <div
                                    className="bubble-legend"
                                    style={{
                                        backgroundColor: bubbleColor,
                                    }}
                                ></div>
                                <p>
                                    {i18n.t(
                                        "clusterStoryCommon:data.types.legend"
                                    )}
                                </p>
                            </div>
                            {dataType.id !== "by-types" ? (
                                <>
                                    <MatrixBubblesChart
                                        data={dataType.data}
                                        bubbleColor={bubbleColor}
                                        textColor={bubbleColor}
                                        strokeColor={bubbleStroke}
                                    />
                                    <SourceInfoButton
                                        infoScreenRoute={dataType.route}
                                        source={i18n.t(
                                            "common:source.polyPedia"
                                        )}
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="by-types-bubble-chart">
                                        <PolyChart
                                            type="bubble-cluster"
                                            data={dataType.data[0].bubbles}
                                            width={dataType.data[0].width}
                                            height={dataType.data[0].height}
                                            bubbleColor={bubbleColor}
                                            textColor={(d) =>
                                                d.data.type ===
                                                selectedDataTypeBubble
                                                    ? bubbleTextColor
                                                    : bubbleColor
                                            }
                                            strokeColor={bubbleStroke}
                                            onBubbleClick={handleBubbleClick}
                                            label={showLabel}
                                        />
                                        <h4>{dataType.data[0].title}</h4>
                                    </div>
                                    <SourceInfoButton
                                        infoScreenRoute={dataType.route}
                                        source={i18n.t(
                                            "common:source.polyPedia"
                                        )}
                                    />
                                </>
                            )}
                        </Tab>
                    );
                })}
            </Tabs>
        </>
    );
}
