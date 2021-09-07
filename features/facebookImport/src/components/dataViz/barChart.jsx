import React from "react";

import "./barChart.css";

const BarChart = ({
    data,
    names,
    shouldSort = true,
    onClickBar = () => {},
}) => {
    if (names) data.map((data) => (data.title = data[names]));
    const getHighestCount = () => {
        let highest = 0;
        data.forEach((e) => {
            e.count > highest ? (highest = e.count) : null;
        });
        return highest;
    };

    if (shouldSort) {
        data.sort((a, b) => b.count - a.count);
    }

    const fillScale = (highest, multiple) => {
        const scale = [];
        for (
            let i = multiple;
            i <= Math.ceil(highest / multiple) * multiple;
            i += multiple
        ) {
            scale.push(i);
        }
        return scale;
    };

    /*
    const calculateScaleValues = (highest) => {
        //TODO: make this a clever algorithm to determine a pretty scale
        return fillScale(highest, parseInt((highest / 10) * 1.1));
    };*/

    const highestCount = getHighestCount();
    const scaleMultiple = parseInt((highestCount / 10) * 1.1);
    const scaleValues = fillScale(highestCount, scaleMultiple);
    const scale = (
        <div className="scale-container">
            <div className="scale">
                <div className="origin">
                    <p>0</p>
                    <div></div>
                </div>
                {scaleValues.map((value, index) => (
                    <div key={index} className="tick-box">
                        <div className="half-tick"></div>
                        <div className="tick"></div>
                        <p>{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const bars = (
        <div className="bars">
            {data.map(({ title, count }, index) => (
                <div key={index} className="bar-box" onClick={onClickBar}>
                    <div className="above-bar">
                        <p className="name">{title}</p>
                    </div>
                    <div
                        className="bar"
                        style={{
                            width:
                                (count / scaleValues[scaleValues.length - 1]) *
                                    100 +
                                "%",
                        }}
                    >
                        <p>{count / highestCount > 0.1 ? count : ""}</p>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bar-chart">
            {scale}
            {bars}
        </div>
    );
};

export default BarChart;
