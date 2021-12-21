import React, { useEffect, useRef } from "react";
import { PolyChart } from "@polypoly-eu/poly-look";
import * as d3 from "d3";

import "./MatrixBubblesChart.css";

const MatrixBubblesChart = ({ data, bubbleColor, textColor, strokeColor }) => {
    const matrixBubbleChartWidth = 65;
    const matrixBubbleChartHeight = 50;
    const chartRef = useRef();

    useEffect(() => {
        d3.select(chartRef.current);
    }, []);

    return (
        <div className="matrix-bubble-chart">
            {data.map((dataBubble, i) => {
                return (
                    <div
                        className="bubble-cluster-container"
                        key={i}
                        ref={chartRef}
                    >
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
