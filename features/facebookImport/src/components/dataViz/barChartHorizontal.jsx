import React from "react";

import generateScale from "../../model/generate-scale";

import "./barChartHorizontal.css";

const BarChartHorizontal = ({ data, barSize = "small" }) => {
    //TODO: Calculate this depending on how many bars there are and the input
    const barWidth =
        {
            small: "6px",
            big: "22px",
        }[barSize] || "6px";

    const xValues = Object.keys(data);
    const scale = generateScale(Math.max(...Object.values(data)));
    const scaleRefNumber = scale[scale.length - 1];

    //returns scale value bottom percent value
    const scaleHeight = (index) => {
        return 10 + 90 * ((index + 1) / scale.length);
    };

    const xPosition = (index) => {
        return 12.5 + 80 * (index / (xValues.length - 1));
    };

    const barHeight = (barValue) => {
        return barValue ? 90 * (barValue / scaleRefNumber) : 1;
    };

    return (
        <div className="bar-chart-horizontal-container">
            <div className="bar-chart-horizontal">
                <div className="gridline" style={{ bottom: "10%" }}></div>
                <div className="y-axis" style={{ bottom: "10%" }}>
                    0
                </div>
                {scale.map((scaleValue, index) => (
                    <div key={index}>
                        <div
                            className="gridline"
                            style={{ bottom: `${scaleHeight(index)}%` }}
                        ></div>
                        <div
                            className="y-axis"
                            style={{ bottom: `${scaleHeight(index)}%` }}
                        >
                            {scaleValue}
                        </div>
                    </div>
                ))}

                {xValues.map((xValue, index) => (
                    <div key={index}>
                        <div
                            className="x-axis"
                            style={{
                                left: `${xPosition(index)}%`,
                                transform: `translateX(-${
                                    xValue.toString().length * 3
                                }px)`,
                            }}
                        >
                            {xValue}
                        </div>
                        <div
                            className="bar"
                            style={{
                                height: `${barHeight(data[xValue])}%`,
                                width: `${barWidth}`,
                                left: `${xPosition(index)}%`,
                                transform: `translateX(-58%)`,
                            }}
                        />
                    </div>
                ))}
                <div className="unit"></div>
            </div>
        </div>
    );
};

export default BarChartHorizontal;
