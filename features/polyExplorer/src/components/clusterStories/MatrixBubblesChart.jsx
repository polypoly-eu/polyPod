import React from "react";
import { PolyChart } from "@polypoly-eu/poly-look";

import "./MatrixBubblesChart.css";

const MatrixBubblesChart = ({ data, bubbleColor, textColor, strokeColor }) => {
    const matrixBubbleChartWidth = 65;
    const matrixBubbleChartHeight = 50;

    return (
        <div className="matrix-bubble-chart">
            {data.map((dataBubble, i) => {
                return (
                    <div className="bubble-cluster-container" key={i}>
                        <PolyChart
                            type="bubble-cluster"
                            data={dataBubble.bubbles}
                            width={matrixBubbleChartWidth}
                            height={matrixBubbleChartHeight}
                            bubbleColor={bubbleColor}
                            textColor={textColor}
                            strokeColor={strokeColor}
                        />
                        <h4>{dataBubble.title}</h4>
                    </div>
                );
            })}
        </div>
    );
};

export default MatrixBubblesChart;
