import React from "react";

import "./barChart.css";

const BarChart = ({ data, onClickBar = () => {} }) => {
    const getHighestCount = () => {
        let highest = 0;
        data.forEach((e) => {
            e.count > highest ? (highest = e.count) : null;
        });
        return highest;
    };

    data.sort((a, b) => b.count - a.count);

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

    const calculateScaleValues = (highest) => {
        //TODO: make this a clever algorithm to determine a pretty scale
        /*if (highest < 35) return fillScale(highest, 5);
        else if (highest <= 70) return fillScale(highest, 10);
        else if (highest <= 140) return fillScale(highest, 20);
        else if (highest <= 200) return fillScale(highest, 25);
        else if (highest <= 400) return fillScale(highest, 50);
        else if (highest <= 1000) return fillScale(highest, 100);
        else if (highest <= 10000) return fillScale(highest, 1000);
        else if (highest <= 100000) return fillScale(highest, 10000);
        else if (highest <= 1000000) return fillScale(highest, 100000);
        else return fillScale(highest, 1000000);*/

        // unpretty scale but good enough for now
        return fillScale(highest, parseInt((highest % 10) * 1.1));
    };
    const highestCount = getHighestCount();
    const scaleValues = calculateScaleValues(highestCount);
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
                        style={{ width: (count / highestCount) * 95 + "%" }}
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
