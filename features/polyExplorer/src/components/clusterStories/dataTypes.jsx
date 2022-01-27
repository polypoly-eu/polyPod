import React, { useState } from "react";

import MatrixBubblesChart from "./MatrixBubblesChart.jsx";
import SourceInfoButton from "../sourceInfoButton/sourceInfoButton.jsx";
import { Tabs, Tab, PolyChart } from "@polypoly-eu/poly-look";
import i18n from "../../i18n.js";

export default function DataTypes({ dataTypes, dataTypesSharedCombined }) {
    const bubbleColor = "#FB8A89";
    const bubbleStroke = "none";
    const bubbleTextColor = "#0f1938";

    const [selectedDataTypeBubble, setSelectedDataTypeBubble] = useState(
        dataTypesSharedCombined[0].total
    );

    const handleBubbleClick = (_, node) => {
        setSelectedDataTypeBubble(node.data.value);
    };

    return (
        <Tabs>
            {dataTypes.map((dataType, i) => {
                return (
                    <Tab
                        id={dataType.id}
                        label={dataType.label}
                        translation={dataType.translation}
                        key={i}
                    >
                        <div className="data-types-legend">
                            <div
                                className="bubble-legend"
                                style={{
                                    backgroundColor: bubbleColor,
                                }}
                            ></div>
                            <p>
                                {i18n.t("clusterStoryCommon:data.types.legend")}
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
                                    source={i18n.t("common:source.polyPedia")}
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
                                        textColor={dataType.data[0].bubbles.map(
                                            (bubble) => {
                                                selectedDataTypeBubble ===
                                                bubble.value
                                                    ? bubbleTextColor
                                                    : bubbleColor;
                                            }
                                        )}
                                        strokeColor={bubbleStroke}
                                        onBubbleClick={handleBubbleClick}
                                    />
                                    <h4>{dataType.data[0].title}</h4>
                                </div>
                                <SourceInfoButton
                                    infoScreenRoute={dataType.route}
                                    source={i18n.t("common:source.polyPedia")}
                                />
                            </>
                        )}
                    </Tab>
                );
            })}
        </Tabs>
    );
}
